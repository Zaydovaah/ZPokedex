import { StyleSheet, Text, View } from 'react-native';

export function EmptyState({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '600',
  },
});
