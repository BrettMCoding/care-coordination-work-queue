import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type QueueStatePanelProps = {
  actionLabel?: string;
  message: string;
  onAction?: () => void;
  title: string;
  type: 'empty' | 'error' | 'loading';
};

export function QueueStatePanel({
  actionLabel,
  message,
  onAction,
  title,
  type,
}: QueueStatePanelProps) {
  return (
    <View style={[styles.panel, type === 'error' && styles.errorPanel]}>
      {type === 'loading' && <ActivityIndicator color="#375d6a" size="small" />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center',
    backgroundColor: '#fffdf8',
    borderColor: '#ded6c8',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  errorPanel: {
    backgroundColor: '#fff5f0',
    borderColor: '#e6b79e',
  },
  title: {
    color: '#172026',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    textAlign: 'center',
  },
  message: {
    color: '#5f675f',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 560,
    textAlign: 'center',
  },
  action: {
    backgroundColor: '#264c43',
    borderRadius: 8,
    marginTop: 4,
    minHeight: 42,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionPressed: {
    opacity: 0.8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
});
