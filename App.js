import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Modal, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { translations } from './translations';

export default function App() {
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('tr');
  const [isDark, setIsDark] = useState(false); // Karanlık mod ayarı
  const t = translations[lang];

  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [currentAiTip, setCurrentAiTip] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // AI Tavsiyeleri
  const aiTips = {
    "İstanbul": {
      tr: "Boğaz'da gün batımını izle, Karaköy'de kahve iç ve mutlaka gizli geçitleri keşfet! ☕🌉",
      en: "Watch the sunset on the Bosphorus, have coffee in Karaköy, and explore the hidden passages! ☕🌉"
    },
    "Paris": {
      tr: "Eyfel'in kalabalığından kaç, Montmartre'ın ara sokaklarında kaybol... 🎨🥐",
      en: "Escape the crowds of Eiffel, get lost in the side streets of Montmartre... 🎨🥐"
    }
  };

  useEffect(() => {
    loadTrips();
    loadLang();
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem('@theme_key');
    if (savedTheme) setIsDark(savedTheme === 'dark');
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem('@theme_key', newTheme ? 'dark' : 'light');
  };

  const loadLang = async () => {
    const savedLang = await AsyncStorage.getItem('@lang_key');
    if (savedLang) setLang(savedLang);
  };

  const toggleLang = async () => {
    const newLang = lang === 'tr' ? 'en' : 'tr';
    setLang(newLang);
    await AsyncStorage.setItem('@lang_key', newLang);
  };

  const loadTrips = async () => {
    try {
      const savedTrips = await AsyncStorage.getItem('@trips_key');
      if (savedTrips !== null) setTrips(JSON.parse(savedTrips));
    } catch (e) { }
  };

  const saveTrips = async (newTrips) => {
    try {
      await AsyncStorage.setItem('@trips_key', JSON.stringify(newTrips));
    } catch (e) { }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleAddTrip = async () => {
    if (city.trim() === '') {
      Alert.alert(t.errorTitle, t.errorMsg);
      return;
    }
    let quote = "";
    try {
      const response = await fetch('https://api.quotable.io/random?tags=wisdom|inspirational');
      const data = await response.json();
      quote = data.content;
    } catch (e) {
      quote = t.defaultQuote;
    }
    const newTrip = {
      id: Date.now().toString(),
      city: city,
      notes: notes,
      image: image,
      quote: quote,
      date: new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US'),
    };
    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    saveTrips(updatedTrips);
    setCity('');
    setNotes('');
    setImage(null);
  };

  const handleDeleteTrip = (id) => {
    Alert.alert(t.deleteTitle, t.deleteMsg, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        onPress: () => {
          const updatedTrips = trips.filter(trip => trip.id !== id);
          setTrips(updatedTrips);
          saveTrips(updatedTrips);
        },
        style: 'destructive'
      }
    ]);
  };

  const getAiTip = (cityName) => {
    setSelectedCity(cityName);
    const tipData = aiTips[cityName];
    const tip = tipData ? tipData[lang] : (lang === 'tr' ? `${cityName} harika bir seçim! Orada yerel pazarları gezmeyi ve en ünlü yemeği tatmayı unutma! ✨🌸` : `${cityName} is a great choice! Don't forget to visit local markets and taste the most famous food! ✨🌸`);
    setCurrentAiTip(tip);
    setAiModalVisible(true);
  };

  const filteredTrips = trips.filter(trip =>
    trip.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dinamik Temalar
  const theme = {
    bg: isDark ? '#1A1A1A' : '#FFF5F8',
    card: isDark ? '#2D2D2D' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#4F4F4F',
    subText: isDark ? '#AAAAAA' : '#BFA2B2',
    accent: isDark ? '#FF6B8B' : '#FF85A2',
    inputBg: isDark ? '#3D3D3D' : '#FFFFFF',
    borderColor: isDark ? '#444444' : '#FFF0F3',
    quoteBg: isDark ? '#3D2B30' : '#FFF0F3',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topButtons}>
            <TouchableOpacity style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.borderColor }]} onPress={toggleTheme}>
              <Text style={styles.controlBtnText}>{isDark ? '☀️' : '�'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.borderColor }]} onPress={toggleLang}>
              <Text style={[styles.controlBtnText, { color: theme.accent }]}>{lang === 'tr' ? '�🇧 EN' : '🇹🇷 TR'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.decorationsLeft}><Text style={styles.decorText}>🌸</Text></View>
          <View style={styles.decorationsRight}><Text style={styles.decorText}>🌺</Text></View>

          <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, { color: theme.accent }]}>{t.headerTitle}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.subText }]}>{t.headerSubtitle}</Text>
          </View>

          <View style={[styles.formContainer, { backgroundColor: isDark ? 'rgba(45, 45, 45, 0.9)' : 'rgba(255, 255, 255, 0.8)', shadowColor: theme.accent }]}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: isDark ? theme.accent : '#9D8189' }]}>{t.inputLabelCity}</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder={t.inputPlaceholderCity} placeholderTextColor="#777" value={city} onChangeText={setCity} />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: isDark ? theme.accent : '#9D8189' }]}>{t.inputLabelNotes}</Text>
              <TextInput style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder={t.inputPlaceholderNotes} placeholderTextColor="#777" multiline value={notes} onChangeText={setNotes} />
            </View>

            <TouchableOpacity style={[styles.photoInput, { borderColor: theme.accent }, image && styles.photoSelected]} onPress={pickImage}>
              <Text style={[styles.photoInputText, { color: isDark ? theme.accent : '#9D8189' }]}>{image ? t.photoSelected : t.photoButton}</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.previewImage} />}

            <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={handleAddTrip}>
              <Text style={styles.buttonText}>{t.saveButton}</Text>
            </TouchableOpacity>
          </View>

          {trips.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={[styles.listSectionTitle, { color: isDark ? theme.accent : '#9D8189' }]}>{t.listTitle}</Text>
              <View style={styles.searchContainer}>
                <TextInput style={[styles.searchInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.borderColor }]} placeholder={t.searchPlaceholder} placeholderTextColor="#777" value={searchQuery} onChangeText={setSearchQuery} />
              </View>

              {filteredTrips.map((item) => (
                <View key={item.id} style={[styles.tripCard, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
                  <View style={styles.tripCardHeader}>
                    <Text style={[styles.tripCity, { color: theme.accent }]}>📍 {item.city}</Text>
                    <TouchableOpacity onPress={() => handleDeleteTrip(item.id)}><Text style={styles.deleteBtn}>🗑️</Text></TouchableOpacity>
                  </View>
                  <Text style={[styles.tripDate, { color: theme.subText }]}>{item.date}</Text>
                  {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
                  {item.quote && <View style={[styles.quoteWrapper, { backgroundColor: theme.quoteBg, borderLeftColor: theme.accent }]}><Text style={[styles.tripQuote, { color: isDark ? '#DDD' : '#9D8189' }]}>"{item.quote}"</Text></View>}
                  {item.notes && <Text style={[styles.tripNotes, { color: isDark ? '#BBB' : '#7F6B73' }]}>{item.notes}</Text>}
                  <TouchableOpacity style={[styles.aiButton, { backgroundColor: isDark ? '#3D2B3F' : '#F3E5F5', borderColor: isDark ? '#5D3B5F' : '#E1BEE7' }]} onPress={() => getAiTip(item.city)}><Text style={[styles.aiButtonText, { color: isDark ? '#E1BEE7' : '#7B1FA2' }]}>{t.aiButton}</Text></TouchableOpacity>
                  <View style={styles.cardFlower}><Text>🌸</Text></View>
                </View>
              ))}
            </View>
          )}

          <Modal animationType="fade" transparent={true} visible={aiModalVisible} onRequestClose={() => setAiModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                <Text style={styles.modalTitle}>🤖 AI Seyahat Notu</Text>
                <Text style={[styles.modalCity, { color: theme.accent }]}>{selectedCity}</Text>
                <Text style={[styles.modalTip, { color: theme.text }]}>{currentAiTip}</Text>
                <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.accent }]} onPress={() => setAiModalVisible(false)}><Text style={styles.closeBtnText}>{t.modalClose}</Text></TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.footerDecor}><Text style={[styles.footerDecorText, { color: theme.subText }]}>✨ ☁️ 🌿 ☁️ ✨</Text></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 65 },
  topButtons: { position: 'absolute', top: 50, right: 20, flexDirection: 'row', zIndex: 100 },
  controlBtn: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, elevation: 3, justifyContent: 'center', alignItems: 'center' },
  controlBtnText: { fontSize: 13, fontWeight: '700' },
  decorationsLeft: { position: 'absolute', top: 20, left: 10, opacity: 0.4 },
  decorationsRight: { position: 'absolute', top: 40, right: 15, opacity: 0.4 },
  decorText: { fontSize: 52 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  headerTitle: { fontSize: 36, fontWeight: '700', letterSpacing: 1.2, textAlign: 'center' },
  headerSubtitle: { fontSize: 16, marginTop: 8, fontStyle: 'italic' },
  formContainer: { borderRadius: 30, padding: 24, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 10, marginBottom: 40 },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 8 },
  input: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  photoInput: { paddingVertical: 12, borderRadius: 15, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderStyle: 'dashed' },
  photoSelected: { borderStyle: 'solid', backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#4CAF50' },
  photoInputText: { fontSize: 13, fontWeight: '600' },
  previewImage: { width: '100%', height: 150, borderRadius: 15, marginBottom: 15 },
  button: { borderRadius: 20, paddingVertical: 15, alignItems: 'center', marginTop: 5, elevation: 5 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  listContainer: { marginTop: 10 },
  listSectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 15, marginLeft: 8 },
  searchContainer: { marginBottom: 16 },
  searchInput: { borderWidth: 1, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, fontSize: 14 },
  tripCard: { borderRadius: 25, padding: 20, marginBottom: 16, borderWidth: 1, elevation: 3, position: 'relative', overflow: 'hidden' },
  tripCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tripCity: { fontSize: 19, fontWeight: '700' },
  deleteBtn: { fontSize: 18, padding: 4 },
  tripDate: { fontSize: 11, marginBottom: 8, marginLeft: 2 },
  cardImage: { width: '100%', height: 180, borderRadius: 15, marginBottom: 12 },
  tripNotes: { fontSize: 14, lineHeight: 20, marginTop: 8 },
  quoteWrapper: { padding: 10, borderRadius: 15, marginVertical: 8, borderLeftWidth: 4 },
  tripQuote: { fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
  aiButton: { borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 12, borderWidth: 1 },
  aiButtonText: { fontSize: 12, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 30, padding: 30, width: '85%', alignItems: 'center', elevation: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#7B1FA2', marginBottom: 10 },
  modalCity: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  modalTip: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  closeBtn: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 15 },
  closeBtnText: { color: '#FFFFFF', fontWeight: '700' },
  cardFlower: { position: 'absolute', bottom: -10, right: -10, opacity: 0.15, transform: [{ scale: 1.5 }] },
  footerDecor: { marginTop: 40, marginBottom: 60, alignItems: 'center' },
  footerDecorText: { fontSize: 22, opacity: 0.4 },
});
