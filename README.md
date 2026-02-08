# 🚀 Our Universe - Space Shooter Game

[English](#english) | [Türkçe](#turkish)

---

<a name="english"></a>
## 🇬🇧 English

### 🎮 About The Game

**Our Universe** is a modern, fast-paced space shooter game built with cutting-edge web technologies. Pilot your spacecraft through waves of enemies, collect powerful upgrades, and climb the global leaderboard in this visually stunning arcade experience.

### ✨ Key Features

- **🎯 Intense Gameplay**: Face increasingly difficult waves of enemies with adaptive AI
- **💥 Special Weapons**: Triple Shot, Dual Shot, and Surround Fire power-ups
- **🛡️ Power-Ups**: Shields, bombs, and weapon upgrades
- **🏆 Global Leaderboard**: Real-time Firebase integration with worldwide rankings
- **📱 Cross-Platform**: Seamless gameplay on desktop and mobile devices
- **🎨 Stunning Visuals**: Space-themed graphics with particle effects and animations
- **⚡ Smooth Performance**: 60 FPS gameplay with GPU acceleration

### 🎲 Game Mechanics

#### **Enemy Types**
- **Normal Enemies**: Basic threats with standard HP
- **Fast Enemies**: Quick-moving targets (appears after certain score thresholds)
- **Elite Enemies**: High HP, increased rewards (unlocked at 30,000+ points)

#### **Difficulty Scaling**
- Progressive difficulty based on your score
- Enemy spawn rates increase over time
- Wave spawns (2-4 simultaneous enemies) at high scores
- Elite enemy waves with enhanced abilities

#### **Upgrade Shop**
- **Fire Rate**: Increase shooting speed (100 credits)
- **Damage**: Boost bullet damage (150 credits)
- **Shield**: Temporary invincibility (200 credits)

#### **Special Weapons** (Timed Power-ups)
- **⫸ Triple Shot**: Three-way spread fire
- **⫷⫸ Dual Shot**: Side-by-side bullets
- **✦ Surround Fire**: 360-degree attack pattern

### 🛠️ Technologies Used

#### **Frontend Framework**
- **React 18.3.1** - Modern UI library with hooks
- **Vite 5.4.10** - Lightning-fast build tool and dev server

#### **Programming Languages**
- **JavaScript (ES6+)** - Core game logic
- **CSS3** - Styling with animations and GPU acceleration
- **HTML5** - Semantic markup

#### **Backend & Database**
- **Firebase 10.7.1** - Backend-as-a-Service platform
  - **Firestore** - Real-time NoSQL database for leaderboard
  - **Real-time Sync** - Live score updates across all players

#### **UI Components**
- **Lucide React** - Beautiful icon library
  - Rocket, Zap, Shield, Target, Trophy, Star icons

#### **Game Architecture**
- **React Hooks**: `useState`, `useEffect`, `useRef`, `useCallback`
- **Ref-based System**: High-performance state management
- **Direct DOM Manipulation**: For smooth 60 FPS movement
- **GPU Acceleration**: CSS `transform3d` and `will-change`

#### **Performance Optimizations**
- **60 FPS Game Loop**: Optimized setInterval timing
- **Collision Detection**: Optimized with early exit patterns
- **Particle System**: Efficient explosion effects
- **Memory Management**: Proper cleanup and garbage collection

#### **Responsive Design**
- **Touch Controls**: Mobile-optimized input system
- **Mouse Controls**: Precise desktop aiming
- **Keyboard Controls**: WASD + Arrow key support
- **Adaptive UI**: Dynamic canvas sizing

### 📁 Project Structure

```
our-universe/
├── src/
│   ├── StellarAssault.jsx      # Main game component
│   ├── StellarAssault.css      # Game styling
│   ├── firebase.js             # Firebase integration
│   └── main.jsx                # App entry point
├── .env                        # Environment variables (not in repo)
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

### 🚀 Getting Started

#### Prerequisites
- Node.js 16+ and npm
- Firebase account (for leaderboard feature)

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/our-universe.git
cd our-universe
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Get your Firebase configuration from Project Settings
   - Create a `.env` file in the root directory with your Firebase credentials

4. **Run development server**
```bash
npm run dev
```

7. **Build for production**
```bash
npm run build
```

### 🎮 How to Play

#### **Desktop Controls**
- **Mouse**: Move your ship
- **Auto-Fire**: Ship shoots automatically
- **WASD / Arrow Keys**: Alternative movement
- **ESC / P**: Pause game

#### **Mobile Controls**
- **Touch & Drag**: Move your ship
- **Auto-Fire**: Ship shoots automatically

#### **Objective**
- Destroy enemies to earn points and credits
- Spend credits on upgrades in the shop
- Collect power-ups for temporary advantages
- Survive as long as possible
- Aim for the global leaderboard!

### 📊 Game Stats

- **Lives**: 3 (game over when depleted)
- **Credits**: Earned by destroying enemies
- **Score Multipliers**:
  - Normal Enemy: 100 points
  - Fast Enemy: 150 points
  - Elite Enemy: 250 points

### 🔧 Advanced Features

#### **Real-time Leaderboard**
- Automatic score submission on game over
- Live ranking updates
- Player rank display (#1, #2, etc.)
- Total players count

#### **GPU-Accelerated Rendering**
- CSS `transform3d` for smooth animations
- Hardware acceleration via `will-change`
- Direct DOM manipulation for player movement
- Optimized collision detection

#### **Adaptive Difficulty**
- Score-based enemy HP scaling
- Progressive spawn rate increases
- Elite wave mechanics (30k+ score)
- Dynamic enemy speed adjustments

### 🐛 Known Issues & Solutions

- **Performance**: If experiencing lag, close other browser tabs
- **Controls**: Ensure browser has hardware acceleration enabled
- **Firebase**: Check `.env` file if leaderboard isn't working

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

This project is open source and available under the MIT License.

### 👨‍💻 Author

**Emirhan Büyüksenirli** - *Full Stack Developer & Game Designer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/emirhan-buyuksenirli/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/Emirhan-bs)

Built with ❤️ using React, Vite, and Firebase

- 🎮 Passionate about game development and interactive experiences
- 🚀 Specialized in modern web technologies
- 💡 Always learning and building cool stuff
- 💼 Open to collaboration and interesting projects

*This project was created entirely by Emirhan Büyüksenirli as a showcase of modern web game development techniques.*

**Let's connect!** Feel free to reach out on LinkedIn for collaborations, questions, or just to chat about tech and games!

### 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for backend infrastructure
- Lucide for beautiful icons
- Vite for lightning-fast development

---

<a name="turkish"></a>
## 🇹🇷 Türkçe

### 🎮 Oyun Hakkında

**Our Universe**, son teknoloji web teknolojileri ile geliştirilmiş modern, hızlı tempolu bir uzay savaşı oyunudur. Uzay gemini düşman dalgalarına karşı yönlendir, güçlü yükseltmeler topla ve görsel açıdan büyüleyici bu arcade deneyiminde global lider tablosuna tırman.

### ✨ Temel Özellikler

- **🎯 Yoğun Oynanış**: Adaptif yapay zeka ile giderek zorlaşan düşman dalgaları
- **💥 Özel Silahlar**: Üçlü Atış, İkili Atış ve Çember Ateş güçlendirmeleri
- **🛡️ Güçlendirmeler**: Kalkanlar, bombalar ve silah yükseltmeleri
- **🏆 Global Lider Tablosu**: Dünya çapında sıralamalar ile gerçek zamanlı Firebase entegrasyonu
- **📱 Çapraz Platform**: Masaüstü ve mobil cihazlarda kesintisiz oynanış
- **🎨 Muhteşem Görseller**: Partikül efektleri ve animasyonlarla uzay temalı grafikler
- **⚡ Akıcı Performans**: GPU hızlandırması ile 60 FPS oynanış

### 🎲 Oyun Mekaniği

#### **Düşman Türleri**
- **Normal Düşmanlar**: Standart HP ile temel tehditler
- **Hızlı Düşmanlar**: Hızlı hareket eden hedefler (belirli skor eşiklerinden sonra)
- **Elit Düşmanlar**: Yüksek HP, artırılmış ödüller (30.000+ puan sonrası)

#### **Zorluk Ölçeklendirmesi**
- Skorunuza göre artan zorluk
- Zamanla artan düşman oluşum oranları
- Yüksek skorlarda dalga oluşumları (2-4 eş zamanlı düşman)
- Geliştirilmiş yeteneklere sahip elit düşman dalgaları

#### **Yükseltme Mağazası**
- **Atış Hızı**: Ateş etme hızını artır (100 kredi)
- **Hasar**: Mermi hasarını yükselt (150 kredi)
- **Kalkan**: Geçici dokunulmazlık (200 kredi)

#### **Özel Silahlar** (Zamanlı Güçlendirmeler)
- **⫸ Üçlü Atış**: Üç yönlü yayılma ateşi
- **⫷⫸ İkili Atış**: Yan yana mermiler
- **✦ Çember Ateş**: 360 derece saldırı deseni

### 🛠️ Kullanılan Teknolojiler

#### **Frontend Framework**
- **React 18.3.1** - Hook'lar ile modern UI kütüphanesi
- **Vite 5.4.10** - Şimşek hızında derleme aracı ve dev server

#### **Programlama Dilleri**
- **JavaScript (ES6+)** - Çekirdek oyun mantığı
- **CSS3** - Animasyonlar ve GPU hızlandırması ile stil
- **HTML5** - Semantik işaretleme

#### **Backend & Veritabanı**
- **Firebase 10.7.1** - Servis olarak Backend platformu
  - **Firestore** - Lider tablosu için gerçek zamanlı NoSQL veritabanı
  - **Gerçek Zamanlı Senkronizasyon** - Tüm oyuncular arasında canlı skor güncellemeleri

#### **UI Bileşenleri**
- **Lucide React** - Güzel ikon kütüphanesi
  - Rocket, Zap, Shield, Target, Trophy, Star ikonları

#### **Oyun Mimarisi**
- **React Hooks**: `useState`, `useEffect`, `useRef`, `useCallback`
- **Ref Tabanlı Sistem**: Yüksek performanslı durum yönetimi
- **Direkt DOM Manipülasyonu**: Akıcı 60 FPS hareket için
- **GPU Hızlandırma**: CSS `transform3d` ve `will-change`

#### **Performans Optimizasyonları**
- **60 FPS Oyun Döngüsü**: Optimize edilmiş setInterval zamanlaması
- **Çarpışma Tespiti**: Erken çıkış desenleri ile optimize edilmiş
- **Partikül Sistemi**: Verimli patlama efektleri
- **Bellek Yönetimi**: Düzgün temizleme ve çöp toplama

#### **Responsive Tasarım**
- **Dokunma Kontrolleri**: Mobil için optimize edilmiş giriş sistemi
- **Fare Kontrolleri**: Hassas masaüstü nişan alma
- **Klavye Kontrolleri**: WASD + Yön tuşları desteği
- **Uyarlanabilir UI**: Dinamik canvas boyutlandırma

### 📁 Proje Yapısı

```
our-universe/
├── src/
│   ├── StellarAssault.jsx      # Ana oyun bileşeni
│   ├── StellarAssault.css      # Oyun stilleri
│   ├── firebase.js             # Firebase entegrasyonu
│   └── main.jsx                # Uygulama giriş noktası
├── .env                        # Ortam değişkenleri (repo'da değil)
├── .gitignore                  # Git ignore kuralları
├── package.json                # Bağımlılıklar
├── vite.config.js              # Vite yapılandırması
└── README.md                   # Bu dosya
```

### 🚀 Başlarken

#### Ön Gereksinimler
- Node.js 16+ ve npm
- Firebase hesabı (lider tablosu özelliği için)

#### Kurulum

1. **Depoyu klonlayın**
```bash
git clone https://github.com/kullaniciadi/our-universe.git
cd our-universe
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Firebase'i kurun**
   - [console.firebase.google.com](https://console.firebase.google.com) adresinde bir Firebase projesi oluşturun
   - Firestore Database'i etkinleştirin
   - Project Settings'den Firebase yapılandırmanızı alın
   - Kök dizinde Firebase kimlik bilgilerinizle bir `.env` dosyası oluşturun

4. **Geliştirme sunucusunu çalıştırın**
```bash
npm run dev
```

7. **Prodüksiyon için derleyin**
```bash
npm run build
```

### 🎮 Nasıl Oynanır

#### **Masaüstü Kontrolleri**
- **Fare**: Geminizi hareket ettirin
- **Otomatik Ateş**: Gemi otomatik ateş eder
- **WASD / Yön Tuşları**: Alternatif hareket
- **ESC / P**: Oyunu duraklat

#### **Mobil Kontroller**
- **Dokun & Sürükle**: Geminizi hareket ettirin
- **Otomatik Ateş**: Gemi otomatik ateş eder

#### **Hedef**
- Puan ve kredi kazanmak için düşmanları yok edin
- Mağazadan yükseltmeler satın almak için kredi harcayın
- Geçici avantajlar için güçlendirmeler toplayın
- Mümkün olduğunca uzun hayatta kalın
- Global lider tablosunu hedefleyin!

### 📊 Oyun İstatistikleri

- **Canlar**: 3 (tükendiğinde oyun biter)
- **Krediler**: Düşmanları yok ederek kazanılır
- **Skor Çarpanları**:
  - Normal Düşman: 100 puan
  - Hızlı Düşman: 150 puan
  - Elit Düşman: 250 puan

### 🔧 Gelişmiş Özellikler

#### **Gerçek Zamanlı Lider Tablosu**
- Oyun bittiğinde otomatik skor gönderimi
- Canlı sıralama güncellemeleri
- Oyuncu sıralaması gösterimi (#1, #2, vb.)
- Toplam oyuncu sayısı

#### **GPU Hızlandırmalı Render**
- Akıcı animasyonlar için CSS `transform3d`
- `will-change` ile donanım hızlandırma
- Oyuncu hareketi için direkt DOM manipülasyonu
- Optimize edilmiş çarpışma tespiti

#### **Uyarlanabilir Zorluk**
- Skora dayalı düşman HP ölçeklendirmesi
- Artan oluşum oranı artışları
- Elit dalga mekaniği (30k+ skor)
- Dinamik düşman hız ayarlamaları

### 🐛 Bilinen Sorunlar & Çözümler

- **Performans**: Gecikme yaşıyorsanız, diğer tarayıcı sekmelerini kapatın
- **Kontroller**: Tarayıcınızda donanım hızlandırmasının etkin olduğundan emin olun
- **Firebase**: Lider tablosu çalışmıyorsa `.env` dosyasını kontrol edin

### 🤝 Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Lütfen Pull Request göndermekten çekinmeyin.

### 📄 Lisans

Bu proje açık kaynaklıdır ve MIT Lisansı altında mevcuttur.

### 👨‍💻 Yazar

**Emirhan Büyüksenirli** - *Full Stack Developer & Oyun Tasarımcısı*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Bağlan-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/emirhan-buyuksenirli/)
[![GitHub](https://img.shields.io/badge/GitHub-Takip%20Et-181717?style=flat-square&logo=github)](https://github.com/Emirhan-bs)

React, Vite ve Firebase kullanılarak ❤️ ile yapılmıştır

- 🎮 Oyun geliştirme ve interaktif deneyimler konusunda tutkulu
- 🚀 Modern web teknolojilerinde uzman
- 💡 Her zaman öğrenen ve harika şeyler inşa eden
- 💼 İş birliği ve ilginç projelere açık

*Bu proje, modern web oyun geliştirme tekniklerinin bir vitrini olarak tamamen Emirhan Büyüksenirli tarafından oluşturulmuştur.*

**Hadi bağlanalım!** İş birliği, sorular veya sadece teknoloji ve oyunlar hakkında sohbet etmek için LinkedIn'den iletişime geçmekten çekinmeyin!

### 🙏 Teşekkürler

- Harika framework için React ekibine
- Backend altyapısı için Firebase'e
- Güzel ikonlar için Lucide'e
- Şimşek hızında geliştirme için Vite'e

---

## 📞 İletişim / Contact

**Emirhan Büyüksenirli** - Full Stack Developer & Game Designer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/emirhan-buyuksenirli/)

For questions, suggestions, or bug reports:
Sorular, öneriler veya hata raporları için:

- 💼 Connect on LinkedIn / LinkedIn'de bağlantı kurun
- 📧 Reach out for collaboration / İş birliği için iletişime geçin
- 🐛 Create an issue on GitHub / GitHub'da bir issue oluşturun
- ⭐ Star the repository if you like it! / Beğendiyseniz repo'ya yıldız verin!

---

**Made with 🚀 and ❤️ by Emirhan Büyüksenirli | Emirhan Büyüksenirli tarafından 🚀 ve ❤️ ile yapılmıştır**

*A solo project showcasing modern web game development | Modern web oyun geliştirmeyi sergileyen bir solo proje*