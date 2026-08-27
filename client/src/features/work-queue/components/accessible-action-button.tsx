import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type AccessibleActionButtonProps = {
  accessibilityLabel: string;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export function AccessibleActionButton({
  accessibilityLabel,
  label,
  onPress,
  variant = 'primary',
}: AccessibleActionButtonProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      onResponderTerminationRequest={() => true}
      pressRetentionOffset={8}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        isFocused && styles.focusedButton,
        pressed && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
      ]}>
      <Text style={[styles.buttonText, isPrimary ? styles.primaryText : styles.secondaryText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#264c43',
    borderColor: '#264c43',
  },
  secondaryButton: {
    backgroundColor: '#fffdf8',
    borderColor: '#8d7f6d',
  },
  focusedButton: {
    borderColor: '#0b4f6c',
    shadowColor: '#0b4f6c',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  primaryPressed: {
    backgroundColor: '#183b34',
    borderColor: '#183b34',
  },
  secondaryPressed: {
    backgroundColor: '#eee4d6',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    textAlign: 'center',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#1f3d37',
  },
});
