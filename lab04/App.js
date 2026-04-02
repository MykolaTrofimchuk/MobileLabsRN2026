import React, { useState } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  Alert, Modal, TextInput, StatusBar, Platform, Button
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


function FileManagerContent() {
  const insets = useSafeAreaInsets();

  // MOCK FILE SYSTEM
  const [fs, setFs] = useState({
    name: 'root', type: 'folder', children: [
      { name: 'Документи', type: 'folder', children: [] },
      { name: 'Замітки.txt', type: 'file', content: 'Привіт, світ!' },
    ]
  });

  const [path, setPath] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [isFolderMode, setIsFolderMode] = useState(false);

  const getCurrentFolder = () => {
    let current = fs;
    for (let p of path) { current = current.children[p]; }
    return current;
  };
  const currentFolder = getCurrentFolder();

  const handleCreate = () => {
    if (!newItemName.trim()) return;
    const newItem = isFolderMode
      ? { name: newItemName, type: 'folder', children: [] }
      : { name: newItemName + '.txt', type: 'file', content: 'Новий файл' };
    const updated = { ...fs };
    let current = updated;
    for (let p of path) { current = current.children[p]; }
    current.children.push(newItem);
    setFs(updated);
    setNewItemName('');
    setModalVisible(false);
  };

  const openItem = (item, index) => {
    if (item.type === 'folder') {
      setPath([...path, index]);
    } else {
      setEditingFile({ ...item, index });
      setFileContent(item.content);
    }
  };

  const goBack = () => {
    if (path.length === 0) return;
    setPath(path.slice(0, -1));
  };

  const saveFile = () => {
    const updated = { ...fs };
    let current = updated;
    for (let p of path) { current = current.children[p]; }
    current.children[editingFile.index].content = fileContent;
    setFs(updated);
    setEditingFile(null);
    Alert.alert("Успіх", "Файл збережено");
  };

  const deleteItem = (index) => {
    Alert.alert("Видалення", "Ви впевнені?", [
      { text: "Скасувати", style: "cancel" },
      { text: "Так", onPress: () => {
        const updated = { ...fs };
        let current = updated;
        for (let p of path) { current = current.children[p]; }
        current.children.splice(index, 1);
        setFs(updated);
      }}
    ]);
  };

  const headerStyle = [
    styles.header,
    { paddingTop: insets.top + 10 }
  ];

  return (
    <View style={styles.container}>
      <View style={headerStyle}>
        <View style={styles.titleRow}>
           <Ionicons name="folder-open" size={24} color="#FFD60A" style={styles.titleIcon} />
           <Text style={styles.title}>Файловий менеджер</Text>
        </View>
        <View style={styles.navRow}>
          <TouchableOpacity 
            onPress={goBack} 
            style={[styles.backButton, path.length === 0 && { opacity: 0.3 }]}
            disabled={path.length === 0}
          >
            <Ionicons name="arrow-back-circle" size={26} color="#007AFF" />
            <Text style={styles.backText}>Назад</Text>
          </TouchableOpacity>
          <Text style={styles.pathText}>/root</Text>
        </View>
      </View>

      {/* List Section */}
      <FlatList
        data={currentFolder.children}
        contentContainerStyle={styles.listContent}
        keyExtractor={(_, i) => i.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Ця папка порожня</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity onPress={() => openItem(item, index)} style={styles.itemMain}>
              <Ionicons
                name={item.type === 'folder' ? "folder" : "document-text"}
                size={28}
                color={item.type === 'folder' ? "#FFD60A" : "#8E8E93"}
              />
              <Text style={styles.itemName}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteItem(index)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Footer Buttons */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={[styles.actionBtn, styles.folderBtn]} onPress={() => { setIsFolderMode(true); setModalVisible(true); }}>
          <Ionicons name="add-circle" size={18} color="white" />
          <Text style={styles.btnText}>Папка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.fileBtn]} onPress={() => { setIsFolderMode(false); setModalVisible(true); }}>
          <Ionicons name="document-add" size={18} color="white" />
          <Text style={styles.btnText}>Файл</Text>
        </TouchableOpacity>
      </View>

       {/* Create Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{isFolderMode ? "Створити папку" : "Новий текстовий файл"}</Text>
              <TextInput
                style={styles.input}
                value={newItemName}
                onChangeText={setNewItemName}
                placeholder="Введіть назву..."
                autoFocus
              />
              <View style={styles.modalActions}>
                <Button title="Скасувати" color="#FF3B30" onPress={() => setModalVisible(false)} />
                <Button title="Створити" onPress={handleCreate} />
              </View>
            </View>
          </View>
        </Modal>

        {/* Editor Modal */}
        <Modal visible={!!editingFile} animationType="fade">
          {/* Для модального вікна на весь екран теж потрібен SafeAreaView */}
          <SafeAreaView style={styles.editContainer}>
            <View style={styles.editHeader}>
               <Text style={styles.modalTitle}>📝 {editingFile?.name}</Text>
            </View>
            <TextInput
              style={styles.textArea}
              multiline
              value={fileContent}
              onChangeText={setFileContent}
              textAlignVertical="top"
            />
            <View style={styles.editFooter}>
              <TouchableOpacity style={styles.saveBtn} onPress={saveFile}>
                <Text style={styles.btnText}>Зберегти зміни</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setEditingFile(null)}>
                <Text style={styles.closeText}>Закрити</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent />
      <FileManagerContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { paddingHorizontal: 16, pb: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', elevation: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  titleIcon: { marginRight: 8 },
  title: { fontSize: 20, fontWeight: '800', color: '#1c1c1e' },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#007AFF', fontSize: 16, marginLeft: 4, fontWeight: '600' },
  pathText: { color: '#8e8e93', fontSize: 14, fontStyle: 'italic' },
  listContent: { padding: 16, paddingBottom: 120 },
  itemRow: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    padding: 14, borderRadius: 12, marginBottom: 8,
    borderWidth: 1, borderColor: '#efefef'
  },
  itemMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemName: { marginLeft: 12, fontSize: 16, color: '#3a3a3c' },
  deleteBtn: { padding: 4 },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 10,
    backgroundColor: 'rgba(249, 249, 249, 0.9)' 
  },
  actionBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, width: '48%',
  },
  folderBtn: { backgroundColor: '#FFCC00' }, 
  fileBtn: { backgroundColor: '#007AFF' },  
  btnText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#8e8e93', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: { borderBottomWidth: 1, borderColor: '#007AFF', paddingVertical: 8, fontSize: 16, marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-around' },
  editContainer: { flex: 1, backgroundColor: '#fff' },
  editHeader: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  textArea: { flex: 1, padding: 16, fontSize: 16, backgroundColor: '#fdfdfd' },
  editFooter: { padding: 16, gap: 10 },
  saveBtn: { backgroundColor: '#34C759', padding: 14, borderRadius: 10, alignItems: 'center' },
  closeBtn: { alignItems: 'center', padding: 10 },
  closeText: { color: '#FF3B30', fontWeight: '600' }
});