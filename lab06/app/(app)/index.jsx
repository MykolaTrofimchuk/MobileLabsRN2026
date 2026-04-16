import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const { user, logout, deleteAccount } = useAuth();
  const [profile, setProfile] = useState({ name: '', age: '', city: '' });
  const [passwordForDelete, setPasswordForDelete] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Зчитування даних з Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Збереження даних
  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
      Alert.alert('Успіх', 'Дані профілю оновлено!');
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося зберегти дані.');
    }
  };

  // Видалення акаунту
  const handleDeleteConfirm = async () => {
    try {
      await deleteAccount(passwordForDelete);
      Alert.alert('Акаунт видалено');
      // Expo router автоматично перекине на /login завдяки _layout.jsx
    } catch (error) {
      Alert.alert('Помилка', 'Невірний пароль або сталася помилка.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мій Профіль</Text>

      <Text style={styles.label}>Email: {user?.email}</Text>

      <TextInput style={styles.input} placeholder="Ім'я" value={profile.name} onChangeText={(text) => setProfile({...profile, name: text})} />
      <TextInput style={styles.input} placeholder="Вік" keyboardType="numeric" value={profile.age} onChangeText={(text) => setProfile({...profile, age: text})} />
      <TextInput style={styles.input} placeholder="Місто" value={profile.city} onChangeText={(text) => setProfile({...profile, city: text})} />

      <View style={styles.buttonGroup}>
        <Button title="Зберегти дані" onPress={handleSave} />
      </View>
      <View style={styles.buttonGroup}>
        <Button title="Вийти з акаунту" color="gray" onPress={logout} />
      </View>
      <View style={styles.buttonGroup}>
        <Button title="Видалити акаунт" color="red" onPress={() => setModalVisible(true)} />
      </View>

      {/* Модальне вікно для підтвердження видалення */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Підтвердження видалення</Text>
            <Text style={{marginBottom: 10}}>Введіть ваш пароль для підтвердження:</Text>
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              secureTextEntry
              value={passwordForDelete}
              onChangeText={setPasswordForDelete}
            />
            <Button title="Остаточно видалити" color="red" onPress={handleDeleteConfirm} />
            <Button title="Скасувати" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 15, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  buttonGroup: { marginBottom: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10 }
});