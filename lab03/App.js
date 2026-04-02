import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from 'styled-components/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { GameProvider, useGame } from './GameContext';
import HomeScreen from './screens/HomeScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const lightTheme = { background: '#f5f5f5', text: '#333', primary: '#0ea5e9', card: '#fff' };
const darkTheme = { background: '#1e1e1e', text: '#fff', primary: '#38bdf8', card: '#2d2d2d' };

const Navigation = () => {
  const { isDarkTheme } = useGame();
  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ 
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          tabBarStyle: { backgroundColor: theme.card },
          tabBarActiveTintColor: theme.primary,
        }}>
          <Tab.Screen name="Клікер" component={HomeScreen} />
          <Tab.Screen name="Завдання" component={ChallengesScreen} />
          <Tab.Screen name="Налаштування" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <Navigation />
      </GameProvider>
    </GestureHandlerRootView>
  );
}