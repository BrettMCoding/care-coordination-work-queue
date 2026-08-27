import { StyleSheet, Text, View } from 'react-native';

import { AccessibleActionButton } from '@/features/work-queue/components/accessible-action-button';
import { roleLabels, statusLabels, urgencyLabels } from '@/features/work-queue/data/labels';
import type { WorkQueueCase } from '@/features/work-queue/types';

type CaseCardProps = {
  item: WorkQueueCase;
  onViewDetails: (id: string) => void;
};

export function CaseCard({ item, onViewDetails }: CaseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleBlock}>
          <Text style={styles.alias}>{item.clientAlias}</Text>
          <Text style={styles.context}>{item.context}</Text>
        </View>
        <StatusBadge status={item.status} urgency={item.urgency} />
      </View>

      <View style={styles.dateGrid}>
        <Fact label="Last contact" value={formatDisplayDate(item.lastContactDate)} />
        <Fact label="Next follow-up" value={formatDisplayDate(item.nextFollowUpDate)} />
      </View>

      <View style={styles.teamBlock}>
        <Text style={styles.sectionLabel}>Assigned team</Text>
        <View style={styles.teamList}>
          {item.assignedTeam.map((member) => (
            <View key={`${item.id}-${member.name}`} style={styles.teamPill}>
              <Text style={styles.teamName}>{member.name}</Text>
              <Text style={styles.teamRole}>{roleLabels[member.role]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionRow}>
        <AccessibleActionButton
          accessibilityLabel={`View details for ${item.clientAlias}.`}
          label="View details"
          onPress={() => onViewDetails(item.id)}
        />
      </View>
    </View>
  );
}

type FactProps = {
  label: string;
  value: string;
};

function Fact({ label, value }: FactProps) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

type StatusBadgeProps = {
  status: WorkQueueCase['status'];
  urgency: WorkQueueCase['urgency'];
};

function StatusBadge({ status, urgency }: StatusBadgeProps) {
  const statusStyle = status === 'overdue' ? styles.badgeOverdue : styles.badgeDefault;
  const urgencyStyle = urgency === 'urgent' ? styles.urgencyUrgent : styles.urgencyDefault;

  return (
    <View style={styles.badgeColumn}>
      <View style={[styles.badge, statusStyle]}>
        <Text style={styles.badgeText}>{statusLabels[status]}</Text>
      </View>
      <Text style={[styles.urgencyText, urgencyStyle]}>{urgencyLabels[urgency]}</Text>
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
  card: {
    backgroundColor: '#fffdf8',
    borderColor: '#ded6c8',
    borderRadius: 8,
    borderWidth: 1,
    gap: 18,
    padding: 18,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  alias: {
    color: '#172026',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  context: {
    color: '#5f675f',
    fontSize: 14,
    lineHeight: 20,
  },
  badgeColumn: {
    alignItems: 'flex-end',
    gap: 6,
    minWidth: 110,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeDefault: {
    backgroundColor: '#edf5f1',
    borderColor: '#b7d2c7',
  },
  badgeOverdue: {
    backgroundColor: '#fff1e7',
    borderColor: '#e7b48d',
  },
  badgeText: {
    color: '#22322f',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  urgencyDefault: {
    color: '#53665c',
  },
  urgencyUrgent: {
    color: '#9b3d23',
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fact: {
    backgroundColor: '#f7f2ea',
    borderRadius: 8,
    flexBasis: 160,
    flexGrow: 1,
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  factLabel: {
    color: '#6b665f',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  factValue: {
    color: '#172026',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  teamBlock: {
    gap: 8,
  },
  sectionLabel: {
    color: '#4f5a54',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  teamList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  teamPill: {
    backgroundColor: '#eef3ee',
    borderColor: '#cedacd',
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  teamName: {
    color: '#1d2c28',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
  },
  teamRole: {
    color: '#5f675f',
    fontSize: 12,
    lineHeight: 16,
  },
  actionRow: {
    alignItems: 'flex-start',
  },
});
