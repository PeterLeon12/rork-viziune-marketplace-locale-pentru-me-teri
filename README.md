# 🇷🇴 Rork - Viziune Marketplace Local pentru Meșteri

**Aplicație de marketplace local pentru servicii în România**

## 📱 Despre Aplicația

Rork este o platformă de marketplace local care conectează clienții cu meșteri și profesioniști din România. Aplicația permite utilizatorilor să găsească, să contacteze și să evalueze serviciile locale.

## ✨ Funcționalități Principale

### 🔐 Autentificare
- Înregistrare și conectare utilizatori
- Gestionare profil personal
- Roluri separate pentru clienți și profesioniști

### 🏠 Acasă
- Dashboard personalizat
- Servicii recomandate
- Navigare rapidă

### 🔍 Căutare
- Căutare servicii după categorie
- Filtrare după regiune
- Rezultate personalizate

### 💼 Job-uri
- **Pentru clienți**: Postare cereri de servicii
- **Pentru profesioniști**: Vizualizare oportunități
- Gestionare cereri active

### 💬 Mesaje
- Sistem de mesajerie integrat
- Conversații cu profesioniști
- Istoric comunicări

### 👤 Profil
- Gestionare informații personale
- Istoric servicii
- Setări aplicație

## 🛠️ Tehnologii

- **Frontend**: React Native + Expo
- **Navigare**: Expo Router
- **Stilizare**: NativeWind (Tailwind CSS)
- **Stocare**: AsyncStorage
- **Iconuri**: Lucide React Native
- **Limbaj**: TypeScript

## 🚀 Instalare și Rulare

### Cerințe
- Node.js 18+
- npm sau yarn
- Expo CLI

### Pași
```bash
# Clonează repository-ul
git clone https://github.com/PeterLeon12/rork-viziune-marketplace-locale-pentru-me-teri.git

# Intră în director
cd rork-viziune-marketplace-locale-pentru-me-teri

# Instalează dependențele
npm install

# Pornește aplicația
npm start
```

### Comenzi Disponibile
- `npm start` - Pornește Expo cu tunnel
- `npm run android` - Rulează pe Android
- `npm run ios` - Rulează pe iOS
- `npm run lint` - Verifică codul

## 📱 Testare

1. **Instalează Expo Go** pe telefonul tău
2. **Scanează QR code-ul** din terminal
3. **Testează funcționalitățile**:
   - Înregistrare utilizator nou
   - Căutare servicii
   - Postare job-uri
   - Mesajerie

## 🏗️ Structura Proiectului

```
app/
├── (tabs)/           # Navigare cu tab-uri
│   ├── index.tsx     # Pagina principală
│   ├── search.tsx    # Căutare servicii
│   ├── jobs.tsx      # Gestionare job-uri
│   ├── post-job.tsx  # Postare job-uri
│   ├── messages.tsx  # Sistem mesajerie
│   └── optimal-profile.tsx # Profil utilizator
├── login.tsx         # Autentificare
├── register.tsx      # Înregistrare
├── messaging.tsx     # Mesajerie
└── subscription.tsx  # Gestionare abonamente

components/            # Componente reutilizabile
├── SearchBar.tsx     # Bară de căutare
├── RegionSelector.tsx # Selector regiune
└── Loading.tsx       # Componentă loading

contexts/             # Context-uri React
└── SimpleAuthContext.tsx # Gestionare autentificare
```

## 🎯 Caracteristici Tehnice

- **Cross-platform**: iOS și Android
- **Offline-first**: Funcționează fără internet
- **Performance**: Optimizat pentru dispozitive mobile
- **Accessibility**: Suport pentru accesibilitate
- **Type Safety**: TypeScript pentru cod sigur

## 🤝 Contribuții

1. Fork repository-ul
2. Creează un branch pentru feature (`git checkout -b feature/noua-functie`)
3. Commit schimbările (`git commit -am 'Adaugă funcționalitate nouă'`)
4. Push la branch (`git push origin feature/noua-functie`)
5. Creează un Pull Request

## 📄 Licență

Acest proiect este licențiat sub [MIT License](LICENSE).

## 📞 Contact

- **Dezvoltator**: Peter Leon
- **GitHub**: [@PeterLeon12](https://github.com/PeterLeon12)
- **Proiect**: [Rork Marketplace](https://github.com/PeterLeon12/rork-viziune-marketplace-locale-pentru-me-teri)

---

**🇷🇴 Construit cu ❤️ pentru România**
