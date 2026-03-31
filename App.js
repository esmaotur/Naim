import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [trips, setTrips] = useState([]); // Rotaları tutan liste

  // Uygulama açıldığında verileri yükle
  useEffect(() => {
    loadTrips();
  }, []);

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

  const handleAddTrip = async () => {
    if (city.trim() === '') {
      Alert.alert('Hata', 'Lütfen bir şehir ismi girin 🌸');
      return;
    }

    let quote = "";
    try {
      const response = await fetch('https://api.quotable.io/random?tags=wisdom|inspirational');
      const data = await response.json();
      quote = data.content;
    } catch (e) {
      quote = "Yolculuk, her adımda yeni bir keşiftir. ✨";
    }

    const newTrip = {
      id: Date.now().toString(),
      city: city,
      notes: notes,
      quote: quote,
      date: new Date().toLocaleDateString('tr-TR'),
    };

    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    saveTrips(updatedTrips);
    setCity('');
    setNotes('');
  };

  const handleDeleteTrip = (id) => {
    Alert.alert(
      'Rotayı Sil 🕊️',
      'Bu rotayı silmek istediğinden emin misin?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Dekoratif Çiçekler ve Işıltılar */}
          <View style={styles.decorationsLeft}>
            <Text style={styles.decorText}>🌸</Text>
            <Text style={styles.decorTextSmall}>✨</Text>
          </View>
          <View style={styles.decorationsRight}>
            <Text style={styles.decorTextSmall}>✨</Text>
            <Text style={styles.decorText}>🌺</Text>
          </View>

          {/* Ana Başlık */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Gezginin Rotası</Text>
            <Text style={styles.headerSubtitle}>Dünya Turu Başlıyor... ✨</Text>
          </View>

          {/* Giriş Alanları */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Nereye Gidiyoruz? 🌿</Text>
              <TextInput
                style={styles.input}
                placeholder="Şehir İsmi Yaz..."
                placeholderTextColor="#BDBDBD"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Hayallerin & Notların 📝</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Buraya notlarını bırakabilirsin..."
                placeholderTextColor="#BDBDBD"
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddTrip}>
              <Text style={styles.buttonText}>Rotayı Kaydet 🌸</Text>
            </TouchableOpacity>
          </View>

          {/* Rotalarım Listesi */}
          {trips.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listSectionTitle}>Kaydedilen Rotalarım ✨</Text>
              {trips.map((item) => (
                <View key={item.id} style={styles.tripCard}>
                  <View style={styles.tripCardHeader}>
                    <Text style={styles.tripCity}>📍 {item.city}</Text>
                    <TouchableOpacity onPress={() => handleDeleteTrip(item.id)}>
                      <Text style={styles.deleteBtn}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.tripDate}>{item.date}</Text>

                  {item.quote ? (
                    <View style={styles.quoteWrapper}>
                      <Text style={styles.tripQuote}>"{item.quote}"</Text>
                    </View>
                  ) : null}

                  {item.notes ? (
                    <Text style={styles.tripNotes}>{item.notes}</Text>
                  ) : null}
                  <View style={styles.cardFlower}>
                    <Text>🌸</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Alt Dekorasyon */}
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
    paddingTop: 60,
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
  button: {
    backgroundColor: '#FFB3C6',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
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
    shadowColor: '#FFC1CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
