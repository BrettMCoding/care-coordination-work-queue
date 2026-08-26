import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { QueueDemoState } from '@/features/work-queue/types';

type StateControlsProps = {
  selectedState: QueueDemoState;
  onStateChange: (value: QueueDemoState) => void;
};

const states: { label: string; value: QueueDemoState }[] = [
  { label: 'Data', value: 'ready' },
  { label: 'Loading', value: 'loading' },
  { label: 'Empty', value: 'empty' },
  { label: 'Error', value: 'error' },
];

export function StateControls({ selectedState, onStateChange }: StateControlsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Demo state</Text>
      <View style={styles.buttonRow}>
        {states.map((state) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedState === state.value }}
            key={state.value}
            onPress={() => onStateChange(state.value)}
            style={({ pressed }) => [
              styles.button,
              selectedState === state.value && styles.buttonSelected,
              pressed && styles.buttonPressed,
            ]}>
            <Text
              style={[
                styles.buttonText,
                selectedState === state.value && styles.buttonTextSelected,
              ]}>
              {state.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: '#4f5a54',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    backgroundColor: '#f6efe3',
    borderColor: '#d6cabb',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonSelected: {
    backgroundColor: '#375d6a',
    borderColor: '#375d6a',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#43524c',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  buttonTextSelected: {
    color: '#ffffff',
  },
});
