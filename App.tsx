import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { AgendaHeader } from './components/AgendaHeader';
import { MonthlyView } from './components/MonthlyView';
import { WeekTimelineView } from './components/WeekTimelineView';
import { ZoomableView } from './components/ZoomableView';
import { LoginScreen } from './screens/LoginScreen';
import { BubbleService } from './services/BubbleService';
import { Colors } from './constants/theme';
import { AgendaEvent } from './data/mockEvents';

dayjs.locale('pt-br');

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());

  const weekStart = dayjs(selectedDate).startOf('week');

  // Carregar token salvo ao iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = await BubbleService.getSavedToken();
        if (savedToken) {
          setToken(savedToken);
        }
      } catch (e) {
        console.warn('Erro ao carregar auth', e);
      } finally {
        setIsReady(true);
      }
    };
    checkAuth();
  }, []);

  // Buscar eventos quando o token mudar
  useEffect(() => {
    if (token) {
      loadEvents();
    }
  }, [token]);

  const loadEvents = async () => {
    if (!token) return;
    setLoadingEvents(true);
    try {
      const data = await BubbleService.fetchEvents(token);
      setEvents(data);
    } catch (e) {
      console.error('Erro ao buscar eventos', e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = async () => {
    await BubbleService.logout();
    setToken(null);
    setEvents([]);
  };

  const handleDayPress = useCallback((date: string) => {
    setSelectedDate(date);
    setCurrentMonth(dayjs(date));
  }, []);

  const handlePrevious = useCallback(() => {
    if (isLandscape) {
      const newDate = dayjs(selectedDate).subtract(7, 'day');
      setSelectedDate(newDate.format('YYYY-MM-DD'));
      setCurrentMonth(newDate);
    } else {
      const newMonth = currentMonth.subtract(1, 'month');
      setCurrentMonth(newMonth);
    }
  }, [isLandscape, selectedDate, currentMonth]);

  const handleNext = useCallback(() => {
    if (isLandscape) {
      const newDate = dayjs(selectedDate).add(7, 'day');
      setSelectedDate(newDate.format('YYYY-MM-DD'));
      setCurrentMonth(newDate);
    } else {
      const newMonth = currentMonth.add(1, 'month');
      setCurrentMonth(newMonth);
    }
  }, [isLandscape, selectedDate, currentMonth]);

  const handleToday = useCallback(() => {
    const today = dayjs().format('YYYY-MM-DD');
    setSelectedDate(today);
    setCurrentMonth(dayjs());
  }, []);

  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!token) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <View style={styles.container}>
          <AgendaHeader
            currentDate={isLandscape ? dayjs(selectedDate) : currentMonth}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
            onLogout={handleLogout}
            isLandscape={isLandscape}
          />

          <View style={{ flex: 1, overflow: 'hidden' }}>
            {loadingEvents && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color={Colors.primary} />
              </View>
            )}
            <ZoomableView>
              {isLandscape ? (
                <WeekTimelineView
                  weekStart={weekStart}
                  selectedDate={selectedDate}
                  onDayPress={handleDayPress}
                  events={events}
                  zoomScale={1}
                />
              ) : (
                <MonthlyView
                  selectedDate={selectedDate}
                  currentMonth={currentMonth}
                  onDayPress={handleDayPress}
                  events={events}
                  zoomScale={1}
                />
              )}
            </ZoomableView>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 5,
  }
});
