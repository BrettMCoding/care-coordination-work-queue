import { ActivityIndicator, Modal, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AccessibleActionButton } from '@/features/work-queue/components/accessible-action-button';
import { roleLabels, statusLabels, urgencyLabels } from '@/features/work-queue/data/labels';
import type { CaseDetailState } from '@/features/work-queue/state/case-detail-state';
import type { WorkQueueCase } from '@/features/work-queue/types';

type CaseDetailModalProps = {
  onClose: () => void;
  onRetry: () => void;
  state: CaseDetailState;
};

export function CaseDetailModal({ onClose, onRetry, state }: CaseDetailModalProps) {
  const visible = state.kind !== 'closed';
  const modalLabel =
    state.kind === 'ready' ? `Case details for ${state.caseItem.clientAlias}` : 'Case details';

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <View
          accessibilityLabel={modalLabel}
          accessibilityViewIsModal
          accessible
          style={styles.dialog}>
          <ScrollView contentContainerStyle={styles.content}>
            {state.kind === 'loading' && <LoadingContent />}
            {state.kind === 'error' && (
              <ErrorContent message={state.message} onClose={onClose} onRetry={onRetry} />
            )}
            {state.kind === 'ready' && <ReadyContent caseItem={state.caseItem} onClose={onClose} />}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function LoadingContent() {
  return (
    <View style={styles.centeredState}>
      <ActivityIndicator color="#375d6a" size="small" />
      <Text style={styles.title}>Loading case details</Text>
      <Text style={styles.message}>Retrieving the selected synthetic queue record.</Text>
    </View>
  );
}

type ErrorContentProps = {
  message: string;
  onClose: () => void;
  onRetry: () => void;
};

function ErrorContent({ message, onClose, onRetry }: ErrorContentProps) {
  return (
    <View style={styles.centeredState}>
      <Text style={styles.title}>Case details unavailable</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.modalActions}>
        <AccessibleActionButton
          accessibilityLabel="Retry loading case details."
          label="Retry"
          onPress={onRetry}
        />
        <AccessibleActionButton
          accessibilityLabel="Close case details."
          label="Close"
          onPress={onClose}
          variant="secondary"
        />
      </View>
    </View>
  );
}

type ReadyContentProps = {
  caseItem: WorkQueueCase;
  onClose: () => void;
};

function ReadyContent({ caseItem, onClose }: ReadyContentProps) {
  return (
    <View style={styles.detailStack}>
      <View style={styles.detailHeader}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Synthetic case detail</Text>
          <Text style={styles.title}>{caseItem.clientAlias}</Text>
          <Text style={styles.message}>{caseItem.context}</Text>
        </View>
        <AccessibleActionButton
          accessibilityLabel={`Close details for ${caseItem.clientAlias}.`}
          label="Close"
          onPress={onClose}
          variant="secondary"
        />
      </View>

      <View style={styles.detailGrid}>
        <DetailFact label="Status" value={statusLabels[caseItem.status]} />
        <DetailFact label="Urgency" value={urgencyLabels[caseItem.urgency]} />
        <DetailFact label="Last contact" value={formatDisplayDate(caseItem.lastContactDate)} />
        <DetailFact label="Next follow-up" value={formatDisplayDate(caseItem.nextFollowUpDate)} />
      </View>

      <View style={styles.teamBlock}>
        <Text style={styles.sectionTitle}>Assigned team</Text>
        <View style={styles.teamList}>
          {caseItem.assignedTeam.map((member) => (
            <View key={`${caseItem.id}-${member.name}`} style={styles.teamRow}>
              <Text style={styles.teamName}>{member.name}</Text>
              <Text style={styles.teamRole}>{roleLabels[member.role]}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

type DetailFactProps = {
  label: string;
  value: string;
};

function DetailFact({ label, value }: DetailFactProps) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`));
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(23, 32, 38, 0.44)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: Platform.select({ web: 28, default: 18 }),
  },
  dialog: {
    backgroundColor: '#fffdf8',
    borderColor: '#ded6c8',
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: '92%',
    maxWidth: 720,
    width: '100%',
  },
  content: {
    padding: 22,
  },
  centeredState: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
  },
  detailStack: {
    gap: 20,
  },
  detailHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flexBasis: 420,
    flexGrow: 1,
    gap: 6,
  },
  eyebrow: {
    color: '#6f5542',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  title: {
    color: '#172026',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    textAlign: 'left',
  },
  message: {
    color: '#4f5a54',
    fontSize: 15,
    lineHeight: 22,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fact: {
    backgroundColor: '#f7f2ea',
    borderRadius: 8,
    flexBasis: 220,
    flexGrow: 1,
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  factLabel: {
    color: '#6b665f',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  factValue: {
    color: '#172026',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  teamBlock: {
    gap: 10,
  },
  sectionTitle: {
    color: '#172026',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  teamList: {
    gap: 8,
  },
  teamRow: {
    backgroundColor: '#eef3ee',
    borderColor: '#cedacd',
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  teamName: {
    color: '#1d2c28',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  teamRole: {
    color: '#5f675f',
    fontSize: 13,
    lineHeight: 18,
  },
  modalActions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 4,
  },
});
