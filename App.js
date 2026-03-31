import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { translations } from './translations';

export default function App() {
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [trips, setTrips] = useState([]); // Rotaları tutan liste
  const [lang, setLang] = useState('tr'); // Dil ayarı
  const t = translations[lang]; // Mevcut dil çevirileri

  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [currentAiTip, setCurrentAiTip] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // AI Tavsiyeleri (Mock Database)
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
  }, []);

  const loadLang = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('@lang_key');
      if (savedLang) setLang(savedLang);
    } catch (e) { }
  };

  const toggleLang = async () => {
    const newLang = lang === 'tr' ? 'en' : 'tr';
    setLang(newLang);
    await AsyncStorage.setItem('@lang_key', newLang);
  };

  const loadTrips = async () => {
    try {
      const savedTrips = await AsyncStorage.getItem('@trips_key');
      if (savedTrips !== null) {
        setTrips(JSON.parse(savedTrips));
      }
    } catch (e) {
      console.error("Veriler yüklenirken hata oluştu:", e);
    }
  };

  const saveTrips = async (newTrips) => {
    try {
      const jsonValue = JSON.stringify(newTrips);
      await AsyncStorage.setItem('@trips_key', jsonValue);
    } catch (e) {
      console.error("Veriler kaydedilirken hata oluştu:", e);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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
    Alert.alert(
      t.deleteTitle,
      t.deleteMsg,
      [
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
      ]
    );
  };

  const getAiTip = (cityName) => {
    setSelectedCity(cityName);
    const tipData = aiTips[cityName];
    const tip = tipData ? tipData[lang] : (lang === 'tr' ? `${cityName} harika bir seçim! Orada yerel pazarları gezmeyi ve en ünlü yemeği tatmayı unutma! ✨🌸` : `${cityName} is a great choice! Don't forget to visit local markets and taste the most famous food! ✨🌸`);
    setCurrentAiTip(tip);
    setAiModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.langSwitch} onPress={toggleLang}>
            <Text style={styles.langText}>{lang === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}</Text>
          </TouchableOpacity>

          <View style={styles.decorationsLeft}>
            <Text style={styles.decorText}>🌸</Text>
            <Text style={styles.decorTextSmall}>✨</Text>
          </View>
          <View style={styles.decorationsRight}>
            <Text style={styles.decorTextSmall}>✨</Text>
            <Text style={styles.decorText}>🌺</Text>
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{t.headerTitle}</Text>
            <Text style={styles.headerSubtitle}>{t.headerSubtitle}</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t.inputLabelCity}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.inputPlaceholderCity}
                placeholderTextColor="#BDBDBD"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t.inputLabelNotes}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t.inputPlaceholderNotes}
                placeholderTextColor="#BDBDBD"
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <TouchableOpacity style={[styles.photoInput, image && styles.photoSelected]} onPress={pickImage}>
              <Text style={styles.photoInputText}>{image ? t.photoSelected : t.photoButton}</Text>
            </TouchableOpacity>

            {image && (
              <Image source={{ uri: image }} style={styles.previewImage} />
            )}

            <TouchableOpacity style={styles.button} onPress={handleAddTrip}>
              <Text style={styles.buttonText}>{t.saveButton}</Text>
            </TouchableOpacity>
          </View>

          {trips.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listSectionTitle}>{t.listTitle}</Text>
              {trips.map((item) => (
                <View key={item.id} style={styles.tripCard}>
                  <View style={styles.tripCardHeader}>
                    <Text style={styles.tripCity}>📍 {item.city}</Text>
                    <TouchableOpacity onPress={() => handleDeleteTrip(item.id)}>
                      <Text style={styles.deleteBtn}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.tripDate}>{item.date}</Text>

                  {item.image && (
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                  )}

                  {item.quote ? (
                    <View style={styles.quoteWrapper}>
                      <Text style={styles.tripQuote}>"{item.quote}"</Text>
                    </View>
                  ) : null}

                  {item.notes ? (
                    <Text style={styles.tripNotes}>{item.notes}</Text>
                  ) : null}

                  <TouchableOpacity style={styles.aiButton} onPress={() => getAiTip(item.city)}>
                    <Text style={styles.aiButtonText}>{t.aiButton}</Text>
                  </TouchableOpacity>

                  <View style={styles.cardFlower}>
                    <Text>🌸</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={aiModalVisible}
            onRequestClose={() => setAiModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t.aiModalTitle}</Text>
                <Text style={styles.modalCity}>{selectedCity}</Text>
                <Text style={styles.modalTip}>{currentAiTip}</Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setAiModalVisible(false)}
                >
                  <Text style={styles.closeBtnText}>{t.modalClose}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.footerDecor}>
            <Text style={styles.footerDecorText}>✨ ☁️ 🌿 ☁️ ✨</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 65,
  },
  langSwitch: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFF0F3',
    elevation: 3,
    zIndex: 100,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF85A2',
  },
  decorationsLeft: {
    position: 'absolute',
    top: 20,
    left: 10,
    opacity: 0.6,
  },
  decorationsRight: {
    position: 'absolute',
    top: 40,
    right: 15,
    opacity: 0.6,
  },
  decorText: {
    fontSize: 52,
  },
  decorTextSmall: {
    fontSize: 20,
    marginTop: 5,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF85A2',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BFA2B2',
    marginTop: 8,
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
    padding: 24,
    shadowColor: '#FFC1CC',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 40,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9D8189',
    marginBottom: 8,
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFF0F3',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#4F4F4F',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoInput: {
    backgroundColor: '#FFF0F3',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FFB3C6',
  },
  photoSelected: {
    borderStyle: 'solid',
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  photoInputText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9D8189',
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FFB3C6',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  listContainer: {
    marginTop: 10,
  },
  listSectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#9D8189',
    marginBottom: 16,
    marginLeft: 8,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFF0F3',
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripCity: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF85A2',
  },
  deleteBtn: {
    fontSize: 18,
    padding: 4,
  },
  tripDate: {
    fontSize: 12,
    color: '#BFA2B2',
    marginBottom: 8,
    marginLeft: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 12,
  },
  tripNotes: {
    fontSize: 14,
    color: '#7F6B73',
    lineHeight: 20,
    marginTop: 8,
  },
  quoteWrapper: {
    backgroundColor: '#FFF0F3',
    padding: 10,
    borderRadius: 15,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB3C6',
  },
  tripQuote: {
    fontSize: 13,
    color: '#9D8189',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  aiButton: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  aiButtonText: {
    color: '#7B1FA2',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7B1FA2',
    marginBottom: 10,
  },
  modalCity: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF85A2',
    marginBottom: 15,
  },
  modalTip: {
    fontSize: 16,
    color: '#4F4F4F',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  closeBtn: {
    backgroundColor: '#FFB3C6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 15,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardFlower: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    opacity: 0.2,
    transform: [{ scale: 1.5 }],
  },
  footerDecor: {
    marginTop: 40,
    marginBottom: 60,
    alignItems: 'center',
  },
  footerDecorText: {
    fontSize: 24,
    opacity: 0.4,
  },
});
