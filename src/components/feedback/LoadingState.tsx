import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#E84D3D" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '600',
  },
});
