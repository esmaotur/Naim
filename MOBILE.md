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

---

## ⚖️ Toplam Ağırlık (Grade Score)
**Toplam Kaldırılan:** 55 kg

---

## 🧠 Refleksiyon
Üçüncü adımda uygulamanın "veri güvenliğini" sağladık. AsyncStorage kurulumu ve yönetimi sayesinde proje çok daha profesyonel bir seviyeye geldi. Silme özelliği ise yönetilebilirliği artırdı. Bir sonraki hedefimiz Hava Durumu veya AI desteği ekleyerek 75-100 kg barajını zorlamak.
