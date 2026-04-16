import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    // Базова валідація пустих полів
    if (!name || !email || !password) {
      Alert.alert('Увага', 'Будь ласка, заповніть усі поля.');
      return;
    }

    // Перевірка збігу паролів
    if (password !== confirmPassword) {
      Alert.alert('Помилка', 'Паролі не збігаються.');
      return;
    }

    try {
      // Викликаємо функцію реєстрації з контексту (яка також створить запис у Firestore)
      await register(email, password, name);
      router.replace('/'); // Перенаправляємо на головний екран після успішної реєстрації
    } catch (error) {
      // Firebase повертає помилки англійською, тому зробимо переклад для найчастіших з них
      let errorMessage = 'Сталася помилка під час реєстрації.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Цей Email вже зареєстровано в системі.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Пароль надто слабкий. Він має містити щонайменше 6 символів.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Некоректний формат Email адреси.';
      } else {
        errorMessage = error.message; // Для інших помилок виводимо оригінальне повідомлення
      }

      Alert.alert('Помилка реєстрації', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Створення акаунту</Text>

      <TextInput
        style={styles.input}
        placeholder="Ваше ім'я"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Підтвердження паролю"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Зареєструватися" onPress={handleRegister} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Вже є акаунт? </Text>
        <Link href="/login" style={styles.link}>Увійти</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  footerText: {
    fontSize: 15,
    color: '#555'
  },
  link: {
    color: '#007BFF',
    fontSize: 15,
    fontWeight: 'bold'
  }
});