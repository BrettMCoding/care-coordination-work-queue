import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CaseCard } from '@/features/work-queue/components/case-card';
import { CaseDetailModal } from '@/features/work-queue/components/case-detail-modal';
import { FilterBar } from '@/features/work-queue/components/filter-bar';
import { QueueStatePanel } from '@/features/work-queue/components/queue-state-panel';
import { StateControls } from '@/features/work-queue/components/state-controls';
import { SummaryStrip } from '@/features/work-queue/components/summary-strip';
import {
  fetchWorkQueueCase,
  fetchWorkQueueCases,
} from '@/features/work-queue/services/work-queue-api';
import type {
  RoleFilter,
  StatusFilter,
} from '@/features/work-queue/services/work-queue-query';
import {
  caseDetailReducer,
  initialCaseDetailState,
} from '@/features/work-queue/state/case-detail-state';
import type { QueueDemoState, WorkQueueCase } from '@/features/work-queue/types';

export function WorkQueueScreen() {
  const { width } = useWindowDimensions();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [demoState, setDemoState] = useState<QueueDemoState>('ready');
  const [cases, setCases] = useState<WorkQueueCase[]>([]);
  const [dataState, setDataState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [caseDetailState, dispatchCaseDetail] = useReducer(
    caseDetailReducer,
    initialCaseDetailState,
  );
  const focusBeforeModalRef = useRef<FocusableElement | null>(null);
  const isWide = width >= 900;

  const loadCases = useCallback(async () => {
    try {
      const nextCases = await fetchWorkQueueCases({
        role: roleFilter,
        sortBy: 'nextFollowUpDate',
        sortDirection: 'asc',
        status: statusFilter,
      });

      setCases(nextCases);
      setDataState('ready');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load work queue.');
      setDataState('error');
    }
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadCases();
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [loadCases, reloadKey]);

  const detailCaseId =
    caseDetailState.kind === 'loading' ? caseDetailState.caseId : null;
  const detailRequestKey =
    caseDetailState.kind === 'loading' ? caseDetailState.requestKey : null;

  useEffect(() => {
    if (!detailCaseId) {
      return;
    }

    let isCurrentRequest = true;

    const loadCaseDetail = async () => {
      try {
        const caseItem = await fetchWorkQueueCase(detailCaseId);

        if (isCurrentRequest) {
          dispatchCaseDetail({ caseId: detailCaseId, caseItem, type: 'loaded' });
        }
      } catch (error) {
        if (isCurrentRequest) {
          dispatchCaseDetail({
            caseId: detailCaseId,
            message: error instanceof Error ? error.message : 'Unable to load case details.',
            type: 'failed',
          });
        }
      }
    };

    void loadCaseDetail();

    return () => {
      isCurrentRequest = false;
    };
  }, [detailCaseId, detailRequestKey]);

  const visibleCases = useMemo(
    () => (demoState === 'empty' ? [] : cases),
    [cases, demoState],
  );

  const renderedState = demoState === 'ready' ? dataState : demoState;
  const displayedErrorMessage =
    demoState === 'error'
      ? 'The prototype could not load the queue. In an API-backed version, this includes retry and logging behavior.'
      : errorMessage;

  const overdueCount = visibleCases.filter((item) => item.status === 'overdue').length;
  const urgentCount = visibleCases.filter((item) => item.urgency === 'urgent').length;

  const returnToQueue = useCallback(() => {
    setDemoState('ready');
    setDataState('loading');
    setErrorMessage(null);
    setReloadKey((current) => current + 1);
  }, []);

  const handleRoleChange = useCallback((value: RoleFilter) => {
    setDataState('loading');
    setErrorMessage(null);
    setRoleFilter(value);
  }, []);

  const handleStatusChange = useCallback((value: StatusFilter) => {
    setDataState('loading');
    setErrorMessage(null);
    setStatusFilter(value);
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    focusBeforeModalRef.current = getActiveFocusableElement();
    dispatchCaseDetail({ caseId: id, type: 'open' });
  }, []);

  const handleCloseDetails = useCallback(() => {
    dispatchCaseDetail({ type: 'close' });
    restoreFocus(focusBeforeModalRef.current);
    focusBeforeModalRef.current = null;
  }, []);

  const handleRetryDetails = useCallback(() => {
    dispatchCaseDetail({ type: 'retry' });
  }, []);

  const isDetailModalVisible = caseDetailState.kind !== 'closed';

  useEffect(() => {
    if (Platform.OS !== 'web' || !isDetailModalVisible || typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseDetails();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCloseDetails, isDetailModalVisible]);

  const queueSourceLabel = useMemo(
    () =>
      process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true'
        ? 'Explicit mock mode is enabled.'
        : 'Queue data loads from the configured API.',
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Synthetic care-team prototype</Text>
              <Text style={styles.title}>Care Team Work Queue</Text>
              <Text style={styles.subtitle}>
                Hi, Brett here. Consider this application my working introduction. I
                rapid-prototyped it using a practical full-stack care-coordination workflow. Below,
                you can explore entirely fictional follow-up work by status, urgency, and assigned
                role.
              </Text>
            </View>
            <View style={styles.headerPanel}>
              <Text style={styles.panelLabel}>Today</Text>
              <Text style={styles.panelDate}>Aug 26, 2026</Text>
              <Text style={styles.panelNote}>{queueSourceLabel}</Text>
            </View>
          </View>

          <View style={[styles.workspace, isWide && styles.workspaceWide]}>
            <View style={[styles.sidebar, isWide && styles.sidebarWide]}>
              <FilterBar
                roleFilter={roleFilter}
                statusFilter={statusFilter}
                onRoleChange={handleRoleChange}
                onStatusChange={handleStatusChange}
              />
              <StateControls selectedState={demoState} onStateChange={setDemoState} />
            </View>

            <View style={styles.queueColumn}>
              <SummaryStrip
                overdueCount={overdueCount}
                urgentCount={urgentCount}
                visibleCount={visibleCases.length}
              />
              <QueueContent
                errorMessage={displayedErrorMessage}
                state={renderedState}
                visibleCases={visibleCases}
                onRetry={returnToQueue}
                onViewDetails={handleViewDetails}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <CaseDetailModal
        state={caseDetailState}
        onClose={handleCloseDetails}
        onRetry={handleRetryDetails}
      />
    </SafeAreaView>
  );
}

type QueueContentProps = {
  errorMessage: string | null;
  onRetry: () => void;
  onViewDetails: (id: string) => void;
  state: QueueDemoState | 'ready';
  visibleCases: WorkQueueCase[];
};

function QueueContent({
  errorMessage,
  onRetry,
  onViewDetails,
  state,
  visibleCases,
}: QueueContentProps) {
  if (state === 'loading') {
    return (
      <QueueStatePanel
        message="The queue is waiting on synthetic follow-up records. This state is manually demonstrable for UI review."
        title="Loading work queue"
        type="loading"
      />
    );
  }

  if (state === 'error') {
    return (
      <QueueStatePanel
        actionLabel="Retry"
        message={errorMessage ?? 'Unable to load the work queue.'}
        title="Queue unavailable"
        type="error"
        onAction={onRetry}
      />
    );
  }

  if (visibleCases.length === 0) {
    return (
      <QueueStatePanel
        actionLabel="Retry queue"
        message="No synthetic cases match the selected filters. Adjust the filters or retry the configured queue data source."
        title="No follow-ups found"
        type="empty"
        onAction={onRetry}
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.caseList}
      data={visibleCases}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CaseCard item={item} onViewDetails={onViewDetails} />}
      scrollEnabled={false}
    />
  );
}

type FocusableElement = {
  focus: () => void;
};

function getActiveFocusableElement(): FocusableElement | null {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return null;
  }

  const activeElement = document.activeElement;

  const focus = activeElement && 'focus' in activeElement ? activeElement.focus : null;

  if (typeof focus === 'function') {
    return {
      focus: () => focus.call(activeElement),
    };
  }

  return null;
}

function restoreFocus(element: FocusableElement | null) {
  if (Platform.OS !== 'web' || !element) {
    return;
  }

  window.setTimeout(() => {
    element.focus();
  }, 0);
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f6f0e6',
    flex: 1,
  },
  screen: {
    backgroundColor: '#f6f0e6',
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 18,
    paddingTop: Platform.select({ web: 28, default: 16 }),
  },
  container: {
    gap: 22,
    maxWidth: 1180,
    width: '100%',
  },
  header: {
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flexBasis: 560,
    flexGrow: 1,
    gap: 8,
  },
  eyebrow: {
    color: '#6f5542',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  title: {
    color: '#172026',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 42,
  },
  subtitle: {
    color: '#4e5a54',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 760,
  },
  headerPanel: {
    backgroundColor: '#fffdf8',
    borderColor: '#ded6c8',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: 260,
    gap: 4,
    padding: 16,
  },
  panelLabel: {
    color: '#6b665f',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  panelDate: {
    color: '#172026',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  panelNote: {
    color: '#59635d',
    fontSize: 13,
    lineHeight: 18,
  },
  workspace: {
    gap: 16,
  },
  workspaceWide: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  sidebar: {
    gap: 14,
  },
  sidebarWide: {
    flexBasis: 320,
    flexShrink: 0,
  },
  queueColumn: {
    flex: 1,
    gap: 14,
    minWidth: 0,
  },
  caseList: {
    gap: 12,
  },
});
