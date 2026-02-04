/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Header } from './src/screens/components/header';
import { ThemeScreen } from './src/screens/theme/ThemeScreen';
import { StatisticScreen } from './src/screens/statistic/StatisticScreen';
import { RepeatScreen } from './src/screens/repeat/RepeatScreen';
import { ProfileScreen } from './src/screens/profile/ProfileScreen';
import UserIcon from 'assets/UserIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThemeIcon from 'assets/ThemeIcon';
import RepeatIcon from 'assets/RepeatIcon';
import BarChartIcon from 'assets/BarChartIcon';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { database } from './src/model';
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  console.log('Database initialized:', database);
  return (
    <DatabaseProvider database={database}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}

const Tabs = createBottomTabNavigator()

function RootTabs() {
    const safeAreaInsets = useSafeAreaInsets();
  return (
    <Tabs.Navigator
      initialRouteName="Theme"
      screenOptions={({ navigation, route }) => ({
        header: (props) => <Header />,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 8,
          display: 'flex',
          width: '100%',
          height: 60 + safeAreaInsets.bottom,
        },
      })}
    >
      <Tabs.Screen
        name="Theme"
        component={ThemeScreen}
        options={{
          tabBarLabel: 'Темы',
          tabBarIcon: ({ color, size }) => <ThemeIcon width={size} height={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Repeat"
        component={RepeatScreen}
        options={{
        
          tabBarLabel: 'Повтор',
          tabBarIcon: ({ color, size }) => <RepeatIcon width={size} height={size} color={color} />,
        }}
      />
        <Tabs.Screen
        name="Statistic"
        component={StatisticScreen}
        options={{
        
          tabBarLabel: 'Статистика',
          tabBarIcon: ({ color, size }) => <BarChartIcon width={size} height={size} color={color} />,
        }}
      />
         <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ color, size }) => <UserIcon width={size} height={size} color={color} />,
        }}
      />
  
    </Tabs.Navigator>
  );
}


function AppContent() {
  return (
      <GestureHandlerRootView style={styles.container}>
      <Host>
        <NavigationContainer>
          <RootTabs />
        </NavigationContainer>
      </Host>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
