import { StyleSheet, Text, View } from 'react-native';

type SummaryStripProps = {
  overdueCount: number;
  urgentCount: number;
  visibleCount: number;
};

export function SummaryStrip({ overdueCount, urgentCount, visibleCount }: SummaryStripProps) {
  return (
    <View style={styles.container}>
      <SummaryMetric label="Visible cases" value={visibleCount} />
      <SummaryMetric label="Overdue" value={overdueCount} tone="attention" />
      <SummaryMetric label="Urgent" value={urgentCount} tone="urgent" />
    </View>
  );
}

type SummaryMetricProps = {
  label: string;
  value: number;
  tone?: 'default' | 'attention' | 'urgent';
};

function SummaryMetric({ label, value, tone = 'default' }: SummaryMetricProps) {
  return (
    <View style={[styles.metric, tone === 'attention' && styles.attentionMetric]}>
      <Text style={[styles.metricValue, tone === 'urgent' && styles.urgentText]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metric: {
    backgroundColor: '#fffdf8',
    borderColor: '#ded6c8',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: 150,
    flexGrow: 1,
    gap: 2,
    padding: 14,
  },
  attentionMetric: {
    backgroundColor: '#fff7ed',
  },
  metricValue: {
    color: '#172026',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  urgentText: {
    color: '#9b3d23',
  },
  metricLabel: {
    color: '#59635d',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
});
