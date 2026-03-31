import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <SafeAreaView style={styles.container}>
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

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Rotayı Kaydet 🌸</Text>
          </TouchableOpacity>
        </View>

        {/* Alt Dekorasyon */}
        <View style={styles.footerDecor}>
          <Text style={styles.footerDecorText}>✨ ☁️ 🌿 ☁️ ✨</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8', // Yumuşak pastel pembe
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
    fontSize: 32,
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
    color: '#FF85A2', // Canlı pembe
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BFA2B2', // Yumuşak gri-mor
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
    height: 120,
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
  footerDecor: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerDecorText: {
    fontSize: 24,
    opacity: 0.4,
  },
});
