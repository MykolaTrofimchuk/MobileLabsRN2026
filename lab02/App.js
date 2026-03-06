import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  View, Text, FlatList, SectionList, Image, StyleSheet, 
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerToggleButton } from '@react-navigation/drawer';

// Модель даних (Генерація тестових даних)
const generateNews = (startIndex = 0, limit = 10) => {
  return Array.from({ length: limit }).map((_, index) => {
    const id = startIndex + index;
    return {
      id: id.toString(),
      title: `Новина #${id + 1}`,
      description: `Це детальний опис для новини під номером ${id + 1}. Тут може бути багато тексту, який описує подію.`,
      image: `https://picsum.photos/seed/${id}/200/150`
    };
  });
};

const CONTACTS_DATA = [
  {
    title: 'Викладачі',
    data: [{ id: '1', name: 'Іванов І.І.' }, { id: '2', name: 'Петров П.П.' }]
  },
  {
    title: 'Студенти',
    data: [{ id: '3', name: 'Коваленко О.В.' }, { id: '4', name: 'Трофімчук М.О.' }]
  }
];

// список новин (FlatList)
function MainScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setData(generateNews(0, 15));
  }, []);

  // Pull-to-Refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData(generateNews(0, 15));
      setRefreshing(false);
    }, 1500);
  };

  // Infinite Scroll
  const onEndReached = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setData(prevData => [...prevData, ...generateNews(prevData.length, 10)]);
      setLoadingMore(false);
    }, 1500);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsItem}
      onPress={() => navigation.navigate('Details', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsTextContainer}>
        <Text style={styles.newsTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.newsDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // Pull-to-refresh
        refreshing={refreshing}
        onRefresh={onRefresh}
        // Infinite Scroll
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={<Text style={styles.listHeader}>Останні події</Text>}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#0000ff" style={{ margin: 20 }}/> : null}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { item } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: item.title });
  }, [navigation, item.title]);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.detailsImage} />
      <View style={{ padding: 15 }}>
        <Text style={styles.detailsTitle}>{item.title}</Text>
        <Text style={styles.detailsDescription}>{item.description}</Text>
      </View>
    </SafeAreaView>
  );
}

// Екран контактів (SectionList)
function ContactsScreen() {
  return (
    <View style={styles.container}>
      <SectionList
        sections={CONTACTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{item.name}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

// Кастомізація Drawer Menu
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerProfile}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
          style={styles.avatar} 
        />
        <Text style={styles.profileName}>Трофімчук Микола</Text>
        <Text style={styles.profileGroup}>Група: ІПЗ-22-2</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// Побудова навігації (Структура)
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function NewsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainScreen} 
        options={{ 
          title: 'Новини',
          headerLeft: () => <DrawerToggleButton /> 
        }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Drawer.Navigator 
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen 
            name="NewsStack" 
            component={NewsStack} 
            options={{ 
              title: 'Новини',
              headerShown: false 
            }} 
          />
          <Drawer.Screen 
            name="Contacts" 
            component={ContactsScreen} 
            options={{ title: 'Контакти' }} 
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  // Списки
  listHeader: { fontSize: 24, fontWeight: 'bold', margin: 15, color: '#333' },
  separator: { height: 1, backgroundColor: '#e0e0e0', marginHorizontal: 15 },
  // Елемент новини
  newsItem: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  newsImage: { width: 80, height: 60, borderRadius: 8, marginRight: 15 },
  newsTextContainer: { flex: 1 },
  newsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  newsDescription: { fontSize: 14, color: '#666' },
  // Екран деталей
  detailsImage: { width: '100%', height: 250 },
  detailsTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  detailsDescription: { fontSize: 16, color: '#444', lineHeight: 24 },
  // Екран контактів
  sectionHeader: { fontSize: 18, fontWeight: 'bold', backgroundColor: '#f4f4f4', padding: 10 },
  contactItem: { padding: 15 },
  contactText: { fontSize: 16 },
  // Кастомний Drawer
  drawerProfile: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  profileName: { fontSize: 18, fontWeight: 'bold' },
  profileGroup: { fontSize: 14, color: '#777', marginTop: 5 },
});