import React from 'react';
import { Text, View, StyleSheet, FlatList, Image, ScrollView, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

const Header = () => (
  <View style={styles.header}>
    <Image 
      source={{ uri: 'https://media.ztu.edu.ua/wp-content/uploads/2020/02/Group-6-1-1024x310.png'}} 
      style={styles.logo} 
      resizeMode="contain"
    />
    <Text style={styles.headerTitle}>FirstMobileApp</Text>
  </View>
);

const Footer = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>Трофімчук Микола Олександрович, ІПЗ-22-2</Text>
  </View>
);

// --- Main ---
const newsData = Array(8).fill({
  id: Math.random().toString(),
  title: 'Заголовок новини',
  date: 'Дата новини',
  text: 'Короткий текст новини',
});

function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.pageTitle}>Новини</Text>
      <FlatList
        data={newsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={30} color="#ccc" />
            </View>
            <View style={styles.newsTextContainer}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDate}>{item.date}</Text>
              <Text style={styles.newsText}>{item.text}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// --- Photogallery ---
const galleryData = Array(10).fill({ id: Math.random().toString() });

function GalleryScreen() {
  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={galleryData}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={styles.galleryRow}
        renderItem={() => <View style={styles.galleryBox} />}
      />
    </View>
  );
}

// --- Registration ---
function ProfileScreen() {
  return (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.pageTitle}>Реєстрація</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Електронна пошта</Text>
        <TextInput style={styles.input} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Пароль</Text>
        <TextInput style={styles.input} secureTextEntry={true} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Пароль (ще раз)</Text>
        <TextInput style={styles.input} secureTextEntry={true} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Прізвище</Text>
        <TextInput style={styles.input} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ім'я</Text>
        <TextInput style={styles.input} />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Зареєструватися</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" />
        <Header />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color }) => {
                let iconName;
                if (route.name === 'Головна') iconName = 'home';
                else if (route.name === 'Фотогалерея') iconName = 'image';
                else if (route.name === 'Профіль') iconName = 'person';
                return <Ionicons name={iconName} size={24} color={color} />;
              },
              tabBarActiveTintColor: '#007bff',
              tabBarInactiveTintColor: 'gray',
              tabBarIndicatorStyle: { backgroundColor: '#007bff' },
              tabBarStyle: { backgroundColor: '#f2f2f2' },
              tabBarLabelStyle: { fontSize: 10, textTransform: 'none' }
            })}
          >
            <Tab.Screen name="Головна" component={HomeScreen} />
            <Tab.Screen name="Фотогалерея" component={GalleryScreen} />
            <Tab.Screen name="Профіль" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        <Footer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff'},
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#fff' },
  logo: { width: 120, height: 40 },
  headerTitle: { fontSize: 18, fontWeight: '500', marginLeft: 'auto' },
  
  // Footer
  footer: { padding: 10, backgroundColor: '#f2f2f2', alignItems: 'center' },
  footerText: { fontStyle: 'italic', fontSize: 12, color: '#555' },

  screenContainer: { flex: 1, backgroundColor: '#fff', padding: 15 },
  pageTitle: { fontSize: 24, textAlign: 'center', marginVertical: 15, fontWeight: '400' },

  // Головна (Новини)
  newsItem: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  imagePlaceholder: { width: 60, height: 60, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  newsTextContainer: { flex: 1 },
  newsTitle: { fontSize: 16 },
  newsDate: { fontSize: 12, color: '#a0a0a0', marginVertical: 2 },
  newsText: { fontSize: 14, color: '#333' },

  // Галерея
  galleryRow: { justifyContent: 'space-between', marginBottom: 15 },
  galleryBox: { width: '47%', height: 120, borderWidth: 1, borderColor: '#ddd', borderRadius: 4 },

  // Профіль (Реєстрація)
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 10, fontSize: 16 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 4, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' }
});