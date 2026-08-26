import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { roleLabels, statusLabels } from '@/features/work-queue/data/labels';
import type { CareTeamRole, FollowUpStatus } from '@/features/work-queue/types';

type StatusFilter = FollowUpStatus | 'all';
type RoleFilter = CareTeamRole | 'all';

type FilterBarProps = {
  roleFilter: RoleFilter;
  statusFilter: StatusFilter;
  onRoleChange: (value: RoleFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
};

const statusOptions: StatusFilter[] = ['all', 'overdue', 'due-soon', 'scheduled', 'waiting'];
const roleOptions: RoleFilter[] = [
  'all',
  'care-coordinator',
  'clinician',
  'peer-support',
  'team-lead',
];

export function FilterBar({
  roleFilter,
  statusFilter,
  onRoleChange,
  onStatusChange,
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      <FilterGroup label="Follow-up status">
        {statusOptions.map((status) => (
          <FilterPill
            key={status}
            label={status === 'all' ? 'All statuses' : statusLabels[status]}
            selected={statusFilter === status}
            onPress={() => onStatusChange(status)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Care-team role">
        {roleOptions.map((role) => (
          <FilterPill
            key={role}
            label={role === 'all' ? 'All roles' : roleLabels[role]}
            selected={roleFilter === role}
            onPress={() => onRoleChange(role)}
          />
        ))}
      </FilterGroup>
    </View>
  );
}

type FilterGroupProps = {
  children: ReactNode;
  label: string;
};

function FilterGroup({ children, label }: FilterGroupProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.pillRow}>{children}</View>
    </View>
  );
}

type FilterPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function FilterPill({ label, selected, onPress }: FilterPillProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        selected && styles.pillSelected,
        pressed && styles.pillPressed,
      ]}>
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffaf0',
    borderColor: '#ded6c8',
    borderRadius: 8,
    borderWidth: 1,
    gap: 18,
    padding: 16,
  },
  group: {
    gap: 8,
  },
  groupLabel: {
    color: '#34443e',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#ffffff',
    borderColor: '#cfc8ba',
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillSelected: {
    backgroundColor: '#264c43',
    borderColor: '#264c43',
  },
  pillPressed: {
    opacity: 0.75,
  },
  pillText: {
    color: '#394740',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  pillTextSelected: {
    color: '#ffffff',
  },
});
