import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';

dayjs.locale('pt-br');

interface AgendaHeaderProps {
  currentDate: dayjs.Dayjs;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onLogout: () => void;
  isLandscape: boolean;
}

const categoryLabels: Record<string, string> = {
  meeting: 'Reunião',
  show: 'Show',
  vip: 'VIP',
  rehearsal: 'Ensaio',
  external: 'Externo',
  staff: 'Staff',
  maintenance: 'Manutenção',
};

export function AgendaHeader({
  currentDate,
  onPrevious,
  onNext,
  onToday,
  onLogout,
  isLandscape,
}: AgendaHeaderProps) {
  const isCurrentMonth = currentDate.format('YYYY-MM') === dayjs().format('YYYY-MM');

  const title = isLandscape
    ? `${currentDate.format('D MMM')} – ${currentDate.add(6, 'day').format('D MMM YYYY')}`
    : currentDate.format('MMMM YYYY');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.title}>
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </Text>
          <Text style={styles.subtitle}>
            {isLandscape ? 'Visão Semanal' : 'Visão Mensal'}
          </Text>
        </View>

        <View style={styles.actions}>
          {!isCurrentMonth && (
            <TouchableOpacity onPress={onToday} style={styles.todayBtn}>
              <Text style={styles.todayBtnText}>Hoje</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onPrevious} style={styles.navBtn}>
            <Text style={styles.navIcon}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNext} style={styles.navBtn}>
            <Text style={styles.navIcon}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color={Colors.text.muted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Legenda de categorias */}
      {!isLandscape && (
        <View style={styles.legend}>
          {Object.entries(Colors.eventColors).map(([key, color]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{categoryLabels[key]}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 48,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  todayBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginRight: Spacing.xs,
  },
  todayBtnText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutBtn: {
    marginLeft: Spacing.sm,
    padding: 6,
  },
  navIcon: {
    color: Colors.text.primary,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '400',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
});
