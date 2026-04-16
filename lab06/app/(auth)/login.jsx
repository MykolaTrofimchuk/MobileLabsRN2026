import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert('Увага', 'Введіть email та пароль.');
        return;
      }

      try {
        await login(email, password);
        router.replace('/');
      } catch (error) {
        // Робимо красивий переклад помилок Firebase
        let errorMessage = 'Сталася помилка під час входу.';

        if (error.code === 'auth/invalid-credential') {
          errorMessage = 'Невірна електронна пошта або пароль. Перевірте дані або зареєструйтесь.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Некоректний формат Email адреси.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Забагато невдалих спроб. Зачекайте хвилинку і спробуйте знову.';
        } else {
          errorMessage = error.message;
        }

        Alert.alert('Помилка входу', errorMessage);
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вхід</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Увійти" onPress={handleLogin} />

      <View style={styles.links}>
        <Link href="/register" style={styles.link}>Реєстрація</Link>
        <Link href="/reset" style={styles.link}>Забули пароль?</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  link: { color: 'blue' }
});