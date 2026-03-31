# 🗺️ Gezginin Rotası - NAIM İterasyon Günlüğü

Uygulama İsmi: **Gezginin Rotası (Naim Mobile)**  
Geliştirici: **Antigravity AI** 🤖  
Tema: **Işıl Işıl, Çiçekli, Sevimli ve Huzurlu 🌸✨**

---

## 🏗️ Detaylı İterasyonlar (Lifts)

### 🏋️ İterasyon 1 — Temel Arayüz Kurulumu (Warm-Up) — 5 kg
- **Açıklama:** Uygulamanın temel iskeleti ve görsel kimliği oluşturuldu.
- **Teknik Detay:** Expo SDK 54 ile `SafeAreaView` ve `KeyboardAvoidingView` kullanılarak cihaz uyumluluğu sağlandı.
- **Tasarım:** Pastel pembe tonlarında (#FFF5F8) bir arka plan ve zarif başlıklar eklendi.

### 🏋️ İterasyon 2 — Dinamik Liste Görünümü (Working Set) — 15 kg
- **Açıklama:** Kullanıcının rotalarını alt alta görebileceği kart tasarımı eklendi.
- **Teknik Detay:** `trips` state'i üzerinden `map` fonksiyonu ile dinamik render işlemi yapıldı.
- **Tasarım:** Kartlara gölge (shadow) ve kavisli köşeler (borderRadius: 25) verilerek modern bir mobil görünüm elde edildi.

### 🏋️ İterasyon 3 — Kalıcı Hafıza & Yönetim — 35 kg
- **Açıklama:** Uygulama kapatılsa bile verilerin silinmemesi için yerel depolama entegre edildi.
- **Teknik Detay:** `@react-native-async-storage/async-storage` kütüphanesi ile `saveTrips` ve `loadTrips` fonksiyonları asenkron olarak yazıldı.
- **Özellik:** Her karta "Sil" butonu eklenerek `Alert.alert` ile kullanıcı onayı mekanizması kuruldu.

### 🏋️ İterasyon 4 — Harici API ile Motivasyon — 20 kg
- **Açıklama:** Rota ekleme anında internetten rastgele ilham verici seyahat sözleri çekilmesi sağlandı.
- **Teknik Detay:** `fetch` API kullanılarak `quotable.io` üzerinden veri çekildi. Hata durumları için (internetsiz kullanım) `fallback` mekanizması eklendi.
- **Tasarım:** Sözler için özel `quoteWrapper` stili ile italic ve soft bir görünüm sağlandı.

### 🏋️ İterasyon 5 — AI Seyahat Danışmanı (Boss Level) — 25 kg
- **Açıklama:** Kullanıcıya gittiği şehir için akıllı tavsiyeler sunan bir asistan eklendi.
- **Teknik Detay:** React Native `Modal` bileşeni kullanılarak "Glassmorphism" efektli bir arayüz tasarlandı.
- **Mantık:** Şehir ismine göre filtreleme yapan bir `aiTips` veritabanı kurgulandı.

### 🏋️ İterasyon 6 — Küresel Vizyon: Çoklu Dil (i18n) — 25 kg
- **Açıklama:** Uygulamanın tüm metinleri Türkçe ve İngilizce olarak dinamikleştirildi.
- **Teknik Detay:** `translations.js` dosyası üzerinden `t[lang]` pattern'i ile merkezi dil yönetimi sağlandı.
- **Özellik:** Header kısmına şık bir dil değiştirme (🇹🇷/🇬🇧) butonu eklendi.

### 🏋️ İterasyon 7 — Görsel Hafıza: Image Picker — 15 kg
- **Açıklama:** Rotalara fotoğraf ekleme yeteneği kazandırıldı.
- **Teknik Detay:** `expo-image-picker` ile cihazın galerisine erişim izni alındı ve seçilen görselin URI bazlı kaydı sağlandı.
- **Tasarım:** Kartların içine görsel önizleme alanı eklendi.

### 🏋️ İterasyon 8 — Hızlı Erişim: Arama & Filtreleme — 20 kg
- **Açıklama:** Liste büyüdüğünde rotaları kolayca bulmayı sağlayan filtre eklendi.
- **Teknik Detay:** `searchQuery` state'i ile eşzamanlı (on-the-fly) filtreleme mantığı `filteredTrips` değişkeni ile kuruldu.
- **Tasarım:** Liste başına şık bir arama çubuğu (Search Bar) yerleştirildi.

### 🏋️ İterasyon 9 — Göz Dostu: Karanlık Mod — 15 kg
- **Açıklama:** Gece kullanımı için koyu tema desteği eklendi.
- **Teknik Detay:** `isDark` state'ine bağlı olarak tüm bileşenlere `theme[isDark]` renk objesi üzerinden dinamik stiller atandı.
- **Özellik:** Tema ayarı `AsyncStorage` ile kalıcı hale getirildi.

---

## ⚖️ Toplam Ağırlık (Grade Score)
**Final Skoru: 175 kg** 🏋️‍♂️🏆🏅  
*Kategori: Super Heavyweight Champion*

---

## 🧠 Refleksiyon
Bu projede, bir fikrin (MVP) adım adım nasıl profesyonel bir ürüne (Full App) dönüştüğünü deneyimledik. "Gezginin Rotası", sadece bir liste uygulaması değil; içinde yapay zeka, çoklu dil, harici veri ve modern UI pratiklerini barındıran kompleks bir mobil çözüm haline gelmiştir.

*Her bir iterasyon, bir başarı hikayesidir.* ✨🌸MAP
