import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PRODUCTS } from '../../../constants/data';

export default function Details() {
  const { id } = useLocalSearchParams();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Товар не знайдено</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price} грн</Text>
      <Text style={styles.description}>{product.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  price: { fontSize: 22, color: 'green', marginBottom: 15 },
  description: { fontSize: 16, textAlign: 'center', color: '#555', lineHeight: 24 },
  error: { fontSize: 18, color: 'red' }
});