import { useMemo, useState } from 'react';
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
import { FilterBar } from '@/features/work-queue/components/filter-bar';
import { QueueStatePanel } from '@/features/work-queue/components/queue-state-panel';
import { StateControls } from '@/features/work-queue/components/state-controls';
import { SummaryStrip } from '@/features/work-queue/components/summary-strip';
import { syntheticCases } from '@/features/work-queue/data/synthetic-cases';
import type {
  CareTeamRole,
  FollowUpStatus,
  QueueDemoState,
  WorkQueueCase,
} from '@/features/work-queue/types';

type StatusFilter = FollowUpStatus | 'all';
type RoleFilter = CareTeamRole | 'all';

export function WorkQueueScreen() {
  const { width } = useWindowDimensions();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [demoState, setDemoState] = useState<QueueDemoState>('ready');
  const isWide = width >= 900;

  const filteredCases = useMemo(
    () => filterCases(syntheticCases, statusFilter, roleFilter),
    [roleFilter, statusFilter],
  );

  const visibleCases = demoState === 'empty' ? [] : filteredCases;
  const overdueCount = visibleCases.filter((item) => item.status === 'overdue').length;
  const urgentCount = visibleCases.filter((item) => item.urgency === 'urgent').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Synthetic care-team prototype</Text>
              <Text style={styles.title}>Care Team Work Queue</Text>
              <Text style={styles.subtitle}>
                Review fictional follow-up work by status, urgency, and assigned role. This
                prototype does not use real client information or make clinical recommendations.
              </Text>
            </View>
            <View style={styles.headerPanel}>
              <Text style={styles.panelLabel}>Today</Text>
              <Text style={styles.panelDate}>Aug 26, 2026</Text>
              <Text style={styles.panelNote}>Demo data is synthetic and manually seeded.</Text>
            </View>
          </View>

          <View style={[styles.workspace, isWide && styles.workspaceWide]}>
            <View style={[styles.sidebar, isWide && styles.sidebarWide]}>
              <FilterBar
                roleFilter={roleFilter}
                statusFilter={statusFilter}
                onRoleChange={setRoleFilter}
                onStatusChange={setStatusFilter}
              />
              <StateControls selectedState={demoState} onStateChange={setDemoState} />
            </View>

            <View style={styles.queueColumn}>
              <SummaryStrip
                overdueCount={overdueCount}
                urgentCount={urgentCount}
                visibleCount={visibleCases.length}
              />
              {renderQueueContent(demoState, visibleCases, () => setDemoState('ready'))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function filterCases(
  cases: WorkQueueCase[],
  statusFilter: StatusFilter,
  roleFilter: RoleFilter,
) {
  return cases.filter((item) => {
    const statusMatches = statusFilter === 'all' || item.status === statusFilter;
    const roleMatches =
      roleFilter === 'all' || item.assignedTeam.some((member) => member.role === roleFilter);

    return statusMatches && roleMatches;
  });
}

function renderQueueContent(
  demoState: QueueDemoState,
  visibleCases: WorkQueueCase[],
  resetState: () => void,
) {
  if (demoState === 'loading') {
    return (
      <QueueStatePanel
        message="The queue is waiting on synthetic follow-up records. This state is manually demonstrable for UI review."
        title="Loading work queue"
        type="loading"
      />
    );
  }

  if (demoState === 'error') {
    return (
      <QueueStatePanel
        actionLabel="Return to demo data"
        message="The prototype could not load the queue. In a later API-backed version, this would include retry and logging behavior."
        title="Queue unavailable"
        type="error"
        onAction={resetState}
      />
    );
  }

  if (visibleCases.length === 0) {
    return (
      <QueueStatePanel
        actionLabel="Show demo data"
        message="No synthetic cases match the selected filters. Adjust the filters or return to the seeded demo queue."
        title="No follow-ups found"
        type="empty"
        onAction={resetState}
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.caseList}
      data={visibleCases}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CaseCard item={item} />}
      scrollEnabled={false}
    />
  );
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
