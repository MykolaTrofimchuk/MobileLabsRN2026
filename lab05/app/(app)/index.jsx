import { View, Text, FlatList, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS } from '../../constants/data';

export default function Home() {
  const { logout } = useAuth();

  const renderItem = ({ item }) => (
    <Link href={`/details/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price} грн</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <Button title="Вийти з акаунту" color="red" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 15 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginBottom: 15, borderRadius: 8, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
  info: { justifyContent: 'center', flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 16, color: 'green' },
  footer: { padding: 20, backgroundColor: '#fff' }
});