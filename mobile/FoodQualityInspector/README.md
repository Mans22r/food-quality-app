# Food Quality Inspector Mobile App

A React Native mobile application for food quality inspectors to login, view forms, and submit reports.

## Features

- User authentication (login/logout)
- View available inspection forms
- Fill out and submit inspection reports
- Responsive mobile interface

## Prerequisites

- Node.js (v14 or higher)
- Expo CLI
- Android Studio or Xcode for emulator/simulator
- Physical device with Expo Go app (optional)

## Compatible Package Versions

To ensure compatibility with Expo, the following package versions are required:
- react-native-gesture-handler: ~2.28.0
- react-native-reanimated: ~4.1.1
- react-native-screens: ~4.16.0
- @react-native-picker/picker: 2.11.1

## Installation

1. Navigate to the mobile app directory:
   ```bash
   cd mobile/FoodQualityInspector
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

Start the Expo development server:
```bash
npm start
```

Then choose one of the following options:

- Press `a` to run on Android emulator/device
- Press `i` to run on iOS simulator
- Press `w` to run on web browser
- Scan the QR code with Expo Go app on your physical device

### Building for Production

To build for Android:
```bash
expo build:android
```

To build for iOS:
```bash
expo build:ios
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── services/       # API and business logic
├── utils/          # Utility functions
└── navigation/     # Navigation configuration
```

## API Configuration

The app connects to the backend API at `http://192.168.1.16:5001/api`. Make sure the backend server is running on port 5001.

The mobile app development server runs on port 8082.

To change the API URL, modify the `baseURL` in `src/services/api.js`.

**Note**: When running on a physical device, you must use your computer's IP address instead of localhost.

## Authentication

The app uses JWT token-based authentication. Tokens are stored securely using AsyncStorage.

Default test credentials:
- Email: inspector@example.com
- Password: inspector123

**Note**: Make sure the backend server is seeded with test data. If these credentials don't work, check the backend database or use the admin credentials to create a new inspector user.

## Supported Form Field Types

- Text inputs
- Text areas
- Number inputs
- Select dropdowns
- Checkboxes

## Troubleshooting

### Common Issues

1. **Network Error**: Ensure the backend server is running on `localhost:5001`
2. **Metro Bundler Issues**: Clear cache with `npm start --reset-cache`
3. **iOS Simulator**: Make sure Xcode is installed and configured
4. **Android Emulator**: Ensure Android Studio and AVD Manager are set up
5. **Package Version Mismatch**: If you see warnings about package versions, install the exact versions specified in the Compatible Package Versions section above

### Development Tips

- Use `console.log` for debugging
- Enable Remote Debugging in Expo DevTools
- Check network requests in the Network tab of Chrome DevTools