import { StyleSheet, View } from 'react-native';

import { PokemonGrid } from '@/components/pokemon/PokemonGrid';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <PokemonGrid />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
});
