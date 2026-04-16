import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  // 1. Поки Firebase завантажує дані сесії, показуємо спінер
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 2. Якщо Firebase відповів, але користувача немає — на сторінку входу
  if (!user) {
    return <Redirect href="/login" />;
  }

  // 3. Якщо користувач є — пускаємо його до додатку
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Профіль' }} />
    </Stack>
  );
}