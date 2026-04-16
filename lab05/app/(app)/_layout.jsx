import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  // Якщо не авторизований - редірект на логін
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Якщо авторизований - показуємо сторінки додатку
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Каталог товарів' }} />
      <Stack.Screen name="details/[id]" options={{ title: 'Деталі товару' }} />
    </Stack>
  );
}