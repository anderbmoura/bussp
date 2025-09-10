# BusSP - Complete Bus Tracking App

🚌 A comprehensive React Native application for tracking São Paulo's public transportation system, built with modern technologies and exceptional UX/UI design.

## 🎯 Features

### Core Functionality
- **Real-time Bus Tracking**: Live position updates using SPTrans Olho Vivo API
- **Smart Search**: Bus line search with autocomplete and suggestions
- **Location Services**: GPS integration for nearby stops discovery
- **Favorites Management**: Save and manage favorite bus lines with persistent storage
- **Search History**: Intelligent search suggestions based on usage patterns
- **Offline Support**: Smart caching system for offline functionality

### User Experience
- **Professional Design**: Clean, modern interface following Material Design principles
- **Dark/Light Theme**: Automatic system preference detection
- **Pull-to-Refresh**: Intuitive refresh functionality across all screens
- **Loading States**: Professional loading indicators and error handling
- **Accessibility**: Screen reader support and high contrast options

## 🛠 Technical Stack

### Frontend
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router with tab-based navigation
- **State Management**: Zustand with React Query
- **Animations**: React Native Reanimated 3
- **Storage**: AsyncStorage with persistent Zustand stores

### Backend Integration
- **API**: SPTrans Olho Vivo Real-time API
- **Authentication**: SPTrans API token-based authentication
- **Caching**: Smart caching with configurable TTL
- **Location**: Expo Location services

### Design System
- **Colors**: Comprehensive color palette with primary/secondary themes
- **Typography**: Scalable typography system
- **Components**: Reusable UI component library (Button, Input, Card, Typography)
- **Spacing**: Consistent spacing scale throughout the app

## 📱 Screens

### Home Screen
- Quick search functionality
- Access to favorites and nearby stops
- Recent searches display

### Search Screen
- Real-time bus line search
- Favorites integration with star buttons
- Error handling and loading states

### Favorites Screen
- Manage saved bus lines
- Notification settings for each favorite
- Delete and edit functionality

### Map Screen
- GPS location detection
- Nearby stops discovery
- Distance calculations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anderbmoura/bussp.git
   cd bussp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on device/simulator:
   ```bash
   npm run ios     # iOS
   npm run android # Android
   npm run web     # Web
   ```

### Development Commands

```bash
npm start        # Start Expo development server
npm run lint     # Run ESLint
npm run reset-project # Reset to clean project structure
```

## 🏗 Architecture

### Project Structure
```
bussp/
├── src/
│   ├── components/
│   │   ├── ui/                 # Design System Components
│   │   └── business/           # Domain-Specific Components
│   ├── screens/                # Screen Components
│   ├── services/               # API and External Services
│   │   ├── api/               # SPTrans API Integration
│   │   ├── cache/             # Caching System
│   │   └── location/          # GPS Services
│   ├── hooks/                 # Custom React Hooks
│   ├── stores/                # Zustand State Stores
│   ├── types/                 # TypeScript Type Definitions
│   ├── utils/                 # Utility Functions
│   └── theme/                 # Design System Theme
└── app/                       # Expo Router Pages
```

### State Management
- **Zustand**: Lightweight state management with TypeScript support
- **React Query**: Server state management with caching
- **AsyncStorage**: Persistent storage for favorites and search history

### API Integration
- **SPTrans Olho Vivo**: Real-time bus tracking data
- **Authentication**: Automatic token-based authentication
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Caching**: Smart caching with configurable expiration times

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2196F3) - Bus tracking theme
- **Secondary**: Orange (#FF9800) - Accent colors
- **Success**: Green (#4CAF50) - Success states
- **Error**: Red (#F44336) - Error states
- **Gray Scale**: Comprehensive gray palette for text and backgrounds

### Components
- **Button**: Multiple variants (primary, secondary, outline, text)
- **Input**: Form inputs with validation and error states
- **Card**: Container component with multiple variants
- **Typography**: Scalable text components with semantic variants

## 🔧 Configuration

### Environment Variables
The app uses the SPTrans Olho Vivo API with the following configuration:
- **API Base URL**: `http://api.olhovivo.sptrans.com.br/v2.1`
- **API Key**: Configured in `src/utils/constants.ts`

### Cache Configuration
- **Bus Positions**: 30 seconds TTL
- **Bus Lines**: 24 hours TTL
- **Bus Stops**: 7 days TTL
- **Search Results**: 1 hour TTL

## 📊 Performance

### Optimization Features
- **Debounced Search**: Reduces API calls during typing
- **Smart Caching**: Minimizes redundant network requests
- **Lazy Loading**: Components loaded on demand
- **Memory Management**: Automatic cleanup of subscriptions

## 🧪 Testing

The project includes comprehensive error handling and loading states. Testing can be added with:
- **Jest**: Unit testing framework
- **React Native Testing Library**: Component testing
- **Detox**: E2E testing (optional)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the [SPTrans API documentation](http://www.sptrans.com.br/desenvolvedores/)

## 🙏 Acknowledgments

- **SPTrans**: For providing the Olho Vivo API
- **Expo Team**: For the excellent React Native platform
- **React Native Community**: For the amazing ecosystem
