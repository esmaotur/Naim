# 📒 MOBILE.md — Gezginin Rotası İterasyon Günlüğü

## 🧘‍♂️ Proje Vizyonu
"Gezginin Rotası", gezilen yerleri huzurlu, soft ve çiçekli bir tasarım eşliğinde kaydeden bir dijital pasaporttur.

---

## 🏗️ İterasyonlar

### İterasyon 1 — Temel Arayüz Kurulumu (Warm-Up)
- **Tarih:** 26 Mart 2026
- **Kaldırılan Ağırlık:** 5 kg 🏋️‍♂️
- **Eklenen Özellikler:** 
    - Expo SDK 54 ile proje kurulumu.
    - "Dünya Turu" temalı ana başlık.
    - Şehir İsmi ve Notlar için giriş alanları.
    - Çiçekli (🌸, 🌺), ışıl ışıl (✨) ve soft renkli (Pastel Pembe) tasarım sistemi.
- **Kullanılan Araçlar:** React Native, Expo, Antigravity.
- **Notlar:** Uygulamanın en temel formu oluşturuldu. Tasarımın "rahatlatıcı" olması için pastel tonlar ve dekoratif emojiler kullanıldı.

### İterasyon 2 — Liste Görünümü (Working Set)
- **Tarih:** 31 Mart 2026
- **Kaldırılan Ağırlık:** 15 kg 🏋️‍♂️
- **Eklenen Özellikler:** 
    - Girilen rotaları aşağıda listeleyen "Rotalarım" bölümü.
    - Her rota için 📍 şehir ismi, tarih ve notları kapsayan şık kart tasarımı.
    - `KeyboardAvoidingView` ile klavye kullanımında kullanıcı deneyimi iyileştirmesi.
    - Kartlar üzerinde minik çiçek süslemeleri.
- **Kullanılan Araçlar:** React Native State management, ScrollView mapping.
- **Notlar:** Kullanıcı artık girdiği rotaları anlık olarak görebiliyor. Toplam ağırlık 20kg'a ulaştı!

### İterasyon 3 — Hafıza ve Yönetim (Heavy Lift)
- **Tarih:** 31 Mart 2026
- **Kaldırılan Ağırlık:** 35 kg 🏋️‍♂️ (AsyncStorage: 20kg + Delete: 15kg)
- **Eklenen Özellikler:** 
    - `AsyncStorage` entegrasyonu ile verilerin telefon hafızasında kalıcı olarak saklanması.
    - Uygulama her açıldığında eski rotaların otomatik yüklenmesi.
    - Her rota kartına "Sil" (🗑️) butonu ve silme onayı (Alert) eklendi.
    - Başarısız girişler için hata uyarıları.
- **Kullanılan Araçlar:** `@react-native-async-storage/async-storage`, `useEffect`, `Alert` API.
- **Notlar:** Uygulama artık "gerçek" bir uygulama gibi davranıyor; veriler kaybolmuyor. 55kg kaldırıldı!

### İterasyon 4 — Motivasyonel Alıntılar API (Heavy Lift)
- **Tarih:** 31 Mart 2026
- **Kaldırılan Ağıvalık:** 20 kg 🏋️‍♂️
- **Eklenen Özellikler:** 
    - `fetch` API ile `quotable.io` adresinden harici veri çekme.
    - Her yeni rota kaydında rastgele bir seyahat/bilgelik sözü eklenmesi.
    - Sözler için özel, soft ve italik tasarım (quoteWrapper).
- **Kullanılan Araçlar:** Fetch API, Async/Await pattern.
- **Notlar:** Uygulama artık dış dünya ile iletişim kuruyor. Toplam ağırlık 75kg!

### İterasyon 5 — AI Seyahat Danışmanı (Boss Level)
- **Tarih:** 31 Mart 2026
- **Kaldırılan Ağırlık:** 25 kg 🏋️‍♂️
- **Eklenen Özellikler:** 
    - Her şehir için özel seyahat ipuçları üreten AI Asistanı mantığı (Mock AI).
    - Şık bir "glassmorphism" Modal tasarımı ile AI tavsiyelerinin sunumu.
    - Her rota kartına özel "AI Tavsiyesi Al" butonu.
    - Popüler şehirler için özel, diğerleri için dinamik tavsiye üretimi.
- **Kullanılan Araçlar:** React Native Modal, State mapping, Logic design.
- **Notlar:** Uygulamaya akıllı bir boyut kazandırıldı. 100kg barajı aşıldı! 🏆

---

## ⚖️ Toplam Ağırlık (Grade Score)
**Toplam Kaldırılan:** 100 kg

---

## 🧠 Refleksiyon
Beşinci adımda projemizin zirve noktalarından birine ulaştık. AI entegrasyonu (simüle edilmiş olsa bile) kullanıcıya katma değer sağlayan en önemli özellik. Tasarımı çiçekli ve sevimli tutarken, modal yapısıyla modern bir mobil uygulama deneyimi sunduk. Artık "Heavyweight" liginde dünya rekoruna (150kg+) doğru ilerliyoruz.
