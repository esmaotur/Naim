import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Modal, Image, StatusBar, ActivityIndicator, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { translations } from './translations';

export default function App() {
  // --- STATE ---
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('tr');
  const [isDark, setIsDark] = useState(false);
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const t = translations[lang];

  // AI Modal States
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [currentAiRoute, setCurrentAiRoute] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');

  // Animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadTrips();
    loadLang();
    loadTheme();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // --- STORAGE ---
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
      const savedTrips = await AsyncStorage.getItem('@trips_key_v2'); // Yeni versiyon veri yapısı
      if (savedTrips !== null) setTrips(JSON.parse(savedTrips));
    } catch (e) { }
  };

  const saveTrips = async (newTrips) => {
    try {
      await AsyncStorage.setItem('@trips_key_v2', JSON.stringify(newTrips));
    } catch (e) { }
  };

  // --- FEATURES ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setNotes(lang === 'tr' ? "Harika bir seyahat planı istiyorum, deniz kenarı olsun." : "I want a great travel plan near the sea.");
      Alert.alert(t.voiceButton, lang === 'tr' ? "Ses algılandı!" : "Voice detected!");
    }, 2000);
  };

  // --- GEMINI AI ENGINE (Simulated Intelligent Generator) ---
  const generateGeminiData = async (cityName, userNotes) => {
    setAiIsLoading(true);
    // Simüle edilmiş AI gecikmesi
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Akıllı içerik üretimi (Dinamik)
    const itn = {
      day1: lang === 'tr' ? `Maceraya ${cityName} merkezinde başla. Yerel lezzetleri tadıp tarihi dokuyu keşfet.` : `Start adventure in ${cityName} center. Taste local flavors and explore history.`,
      day2: lang === 'tr' ? `${userNotes || 'Şehir'} temasına uygun gizli rotaları keşfet. Akşama güzel bir manzara eşliğinde dinlen.` : `Explore hidden gems based on ${userNotes || 'city'}. Relax with a view in the evening.`,
      day3: lang === 'tr' ? "Alışveriş ve son bir veda turu. Mutlaka bir hatıra fotoğrafı çek!" : "Shopping and final farewell tour. Don't forget to take a souvenir photo!",
      weather: Math.floor(Math.random() * 15) + 15 + "°C ☀️",
      aiScore: "9.8/10 ✨"
    };

    setAiIsLoading(false);
    return itn;
  };

  const handleAddTrip = async () => {
    if (city.trim() === '') {
      Alert.alert(t.errorTitle, t.errorMsg);
      return;
    }

    const aiData = await generateGeminiData(city, notes);

    let quote = t.defaultQuote;
    try {
      const response = await fetch('https://api.quotable.io/random?tags=wisdom|inspirational');
      const data = await response.json();
      quote = data.content;
    } catch (e) { }

    const newTrip = {
      id: Date.now().toString(),
      city: city,
      notes: notes,
      image: image,
      quote: quote,
      aiData: aiData,
      date: new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US'),
    };

    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    saveTrips(updatedTrips);
    setCity('');
    setNotes('');
    setImage(null);
  };

  const showAiPlan = (itinerary, cityName) => {
    setSelectedCity(cityName);
    setCurrentAiRoute(itinerary);
    setAiModalVisible(true);
  };

  const filteredTrips = trips.filter(trip =>
    trip.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- THEME ---
  const theme = {
    bg: isDark ? '#121212' : '#FFF5F8',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#E0E0E0' : '#4F4F4F',
    subText: isDark ? '#B0B0B0' : '#BFA2B2',
    accent: isDark ? '#FF6B8B' : '#FF85A2',
    inputBg: isDark ? '#2C2C2C' : '#FFFFFF',
    borderColor: isDark ? '#333333' : '#FFF0F3',
    aiCard: isDark ? '#2D1D3D' : '#F8F0FF',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <Animated.ScrollView contentContainerStyle={[styles.scrollContent, { opacity: fadeAnim }]}>

          <View style={styles.topButtons}>
            <TouchableOpacity style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.borderColor }]} onPress={toggleTheme}>
              <Text style={styles.controlBtnText}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlBtn, { backgroundColor: theme.card, borderColor: theme.borderColor }]} onPress={toggleLang}>
              <Text style={[styles.controlBtnText, { color: theme.accent }]}>{lang === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, { color: theme.accent }]}>{t.headerTitle}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.subText }]}>{t.headerSubtitle}</Text>
          </View>

          <View style={[styles.formContainer, { backgroundColor: theme.card, shadowColor: theme.accent }]}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: theme.accent }]}>{t.inputLabelCity}</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder={t.inputPlaceholderCity} placeholderTextColor="#777" value={city} onChangeText={setCity} />
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: theme.accent }]}>{t.inputLabelNotes}</Text>
                <TouchableOpacity onPress={simulateVoiceInput}>
                  <Text style={{ fontSize: 18 }}>{isListening ? '🛑' : '🎙️'}</Text>
                </TouchableOpacity>
              </View>
              <TextInput style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder={t.inputPlaceholderNotes} placeholderTextColor="#777" multiline value={notes} onChangeText={setNotes} />
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.smallBtn, { borderColor: theme.accent }]} onPress={pickImage}>
                <Text style={[styles.smallBtnText, { color: theme.accent }]}>{image ? '✅' : '📸'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={handleAddTrip} disabled={aiIsLoading}>
              {aiIsLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>{t.saveButton}</Text>
              )}
            </TouchableOpacity>
          </View>

          {trips.length > 0 && (
            <View style={styles.listContainer}>
              <TextInput style={[styles.searchInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.borderColor }]} placeholder={t.searchPlaceholder} placeholderTextColor="#777" value={searchQuery} onChangeText={setSearchQuery} />

              {filteredTrips.map((item) => (
                <View key={item.id} style={[styles.tripCard, { backgroundColor: theme.card, borderColor: theme.borderColor }]}>
                  <View style={styles.tripCardHeader}>
                    <Text style={[styles.tripCity, { color: theme.accent }]}>📍 {item.city}</Text>
                    <TouchableOpacity onPress={() => Alert.alert(t.deleteTitle, t.deleteMsg, [{ text: t.cancel }, { text: t.delete, onPress: () => { setTrips(trips.filter(x => x.id !== item.id)); saveTrips(trips.filter(x => x.id !== item.id)) } }])}>
                      <Text>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.tripDate, { color: theme.subText }]}>{item.date} • {t.weather}: {item.aiData.weather}</Text>

                  {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}

                  <TouchableOpacity style={[styles.geminiBadge, { backgroundColor: theme.aiCard }]} onPress={() => showAiPlan(item.aiData, item.city)}>
                    <Text style={styles.geminiBadgeText}>✨ Gemini AI Plan: {item.aiData.aiScore}</Text>
                  </TouchableOpacity>

                  {item.notes ? <Text style={[styles.tripNotes, { color: theme.text }]}>{item.notes}</Text> : null}
                  <View style={styles.quoteBox}><Text style={styles.quoteText}>"{item.quote}"</Text></View>
                </View>
              ))}
            </View>
          )}

          <Modal animationType="slide" transparent={true} visible={aiModalVisible} onRequestClose={() => setAiModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                <Text style={styles.modalTitle}>{t.aiModalTitle}</Text>
                <Text style={[styles.modalCity, { color: theme.accent }]}>{selectedCity}</Text>

                {currentAiRoute && (
                  <View style={styles.itineraryContainer}>
                    <View style={styles.dayBox}><Text style={styles.dayTitle}>📅 {t.day} 1</Text><Text style={[styles.dayText, { color: theme.text }]}>{currentAiRoute.day1}</Text></View>
                    <View style={styles.dayBox}><Text style={styles.dayTitle}>📅 {t.day} 2</Text><Text style={[styles.dayText, { color: theme.text }]}>{currentAiRoute.day2}</Text></View>
                    <View style={styles.dayBox}><Text style={styles.dayTitle}>📅 {t.day} 3</Text><Text style={[styles.dayText, { color: theme.text }]}>{currentAiRoute.day3}</Text></View>
                  </View>
                )}

                <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.accent }]} onPress={() => setAiModalVisible(false)}>
                  <Text style={styles.closeBtnText}>{t.modalClose}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  topButtons: { position: 'absolute', top: 40, right: 20, flexDirection: 'row' },
  controlBtn: { marginLeft: 10, padding: 8, borderRadius: 15, borderWidth: 1 },
  controlBtnText: { fontWeight: '700' },
  headerContainer: { marginBottom: 30, alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: '800' },
  headerSubtitle: { fontSize: 14, marginTop: 5 },
  formContainer: { borderRadius: 25, padding: 20, elevation: 8, marginBottom: 30 },
  inputWrapper: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  input: { borderWidth: 1, borderRadius: 15, padding: 12, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', marginBottom: 15 },
  smallBtn: { padding: 10, borderRadius: 12, borderWidth: 1, marginRight: 10 },
  button: { borderRadius: 15, padding: 16, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  listContainer: { marginBottom: 50 },
  searchInput: { borderWidth: 1, borderRadius: 15, padding: 12, marginBottom: 20 },
  tripCard: { borderRadius: 20, padding: 15, marginBottom: 15, borderWidth: 1, elevation: 4 },
  tripCardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  tripCity: { fontSize: 20, fontWeight: '700' },
  tripDate: { fontSize: 11, marginVertical: 5 },
  cardImage: { width: '100%', height: 160, borderRadius: 12, marginVertical: 10 },
  geminiBadge: { padding: 10, borderRadius: 10, marginVertical: 5 },
  geminiBadgeText: { color: '#7B1FA2', fontWeight: '700', fontSize: 13 },
  tripNotes: { fontSize: 14, marginTop: 5 },
  quoteBox: { marginTop: 10, opacity: 0.6 },
  quoteText: { fontSize: 12, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', borderRadius: 25, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#7B1FA2' },
  modalCity: { fontSize: 24, fontWeight: '700', marginVertical: 10 },
  itineraryContainer: { width: '100%', marginVertical: 15 },
  dayBox: { marginBottom: 15 },
  dayTitle: { fontWeight: '700', color: '#7B1FA2', marginBottom: 3 },
  dayText: { fontSize: 14, lineHeight: 20 },
  closeBtn: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 15, marginTop: 10 },
  closeBtnText: { color: '#FFF', fontWeight: '700' }
});
