import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { AgendaEvent } from '../data/mockEvents';
import { EventCard } from './EventCard';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';

dayjs.locale('pt-br');

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6h às 23h
const TIME_COL_WIDTH = 48;
const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface WeekTimelineViewProps {
  weekStart: dayjs.Dayjs; // Domingo da semana
  selectedDate: string;
  onDayPress: (date: string) => void;
  events: any[];
  zoomScale: number;
}

interface PositionedEvent {
  event: AgendaEvent;
  dayIndex: number;
  top: number;
  height: number;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getWeekDays(weekStart: dayjs.Dayjs): dayjs.Dayjs[] {
  return Array.from({ length: 7 }, (_, i) => weekStart.startOf('week').add(i, 'day'));
}

export function WeekTimelineView({ weekStart, selectedDate, onDayPress, events, zoomScale }: WeekTimelineViewProps) {
  const currentHourHeight = 64 * zoomScale;
  const weekDays = getWeekDays(weekStart);
  const today = dayjs().format('YYYY-MM-DD');
  const { width } = Dimensions.get('window');
  const dayColWidth = (width - TIME_COL_WIDTH) / 7;

  // Filtrar eventos da semana
  const weekEvents: PositionedEvent[] = [];
  weekDays.forEach((day, dayIndex) => {
    const dateStr = day.format('YYYY-MM-DD');
    const dayEvts = events.filter((e) => e.date === dateStr);
    dayEvts.forEach((event) => {
      const startMin = timeToMinutes(event.startTime);
      const endMin = timeToMinutes(event.endTime) > timeToMinutes(event.startTime)
        ? timeToMinutes(event.endTime)
        : timeToMinutes(event.endTime) + 24 * 60;
      const duration = Math.max(endMin - startMin, 30);
      const top = ((startMin - 6 * 60) / 60) * currentHourHeight;
      const height = Math.max((duration / 60) * currentHourHeight, 28 * zoomScale);
      weekEvents.push({ event, dayIndex, top, height });
    });
  });

  return (
    <View style={styles.container}>
      {/* Header dos dias */}
      <View style={styles.dayHeader}>
        <View style={{ width: TIME_COL_WIDTH }} />
        {weekDays.map((day, i) => {
          const dateStr = day.format('YYYY-MM-DD');
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          return (
            <View key={i} style={[styles.dayHeaderCell, { width: dayColWidth }]}>
              <Text style={styles.dayName}>{DAY_NAMES[day.day()]}</Text>
              <View
                style={[
                  styles.dayNumberCircle,
                  isToday && styles.todayCircle,
                  isSelected && !isToday && styles.selectedCircle,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isToday && styles.todayText,
                    isSelected && !isToday && styles.selectedText,
                  ]}
                >
                  {day.date()}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Timeline */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timelineContent}>
        <View style={styles.timelineBody}>
          {/* Coluna de horas */}
          <View style={[styles.timeCol, { width: TIME_COL_WIDTH }]}>
            {HOURS.map((hour) => (
              <View key={hour} style={[styles.hourCell, { height: currentHourHeight }]}>
                <Text style={styles.hourText}>{String(hour).padStart(2, '0')}h</Text>
              </View>
            ))}
          </View>

          {/* Grade + Eventos */}
          <View style={styles.gridContainer}>
            {/* Linhas horizontais */}
            {HOURS.map((hour) => (
              <View
                key={hour}
                style={[
                  styles.gridLine,
                  { top: (hour - 6) * currentHourHeight, width: '100%' },
                ]}
              />
            ))}

            {/* Colunas dos dias */}
            {weekDays.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dayCol,
                  { left: i * dayColWidth, width: dayColWidth },
                  i < 6 && styles.dayColBorder,
                ]}
              />
            ))}

            {/* Eventos posicionados */}
            {weekEvents.map(({ event, dayIndex, top, height }) => {
              const color = Colors.eventColors[event.category] ?? Colors.primary;
              return (
                <View
                  key={event.id}
                  style={[
                    styles.timelineEvent,
                    {
                      left: dayIndex * dayColWidth + 2,
                      top,
                      width: dayColWidth - 4,
                      height,
                      backgroundColor: color + 'DD',
                      borderLeftColor: color,
                    },
                  ]}
                >
                  <Text style={styles.timelineEventTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  {height > 36 && (
                    <Text style={styles.timelineEventTime}>
                      {event.startTime}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dayHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
  },
  dayHeaderCell: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  dayName: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dayNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    backgroundColor: Colors.today,
  },
  selectedCircle: {
    backgroundColor: Colors.selected,
  },
  dayNumber: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  todayText: {
    color: Colors.white,
    fontWeight: '700',
  },
  selectedText: {
    color: Colors.white,
    fontWeight: '700',
  },
  timelineContent: {
    paddingBottom: 20,
  },
  timelineBody: {
    flexDirection: 'row',
  },
  timeCol: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    backgroundColor: Colors.background,
  },
  hourCell: {
    justifyContent: 'flex-start',
    paddingTop: 4,
    alignItems: 'center',
  },
  hourText: {
    fontSize: 10,
    color: Colors.text.muted,
  },
  gridContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.white,
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: Colors.border,
  },
  dayCol: {
    position: 'absolute',
    top: 0,
    height: '100%',
  },
  dayColBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  timelineEvent: {
    position: 'absolute',
    borderRadius: 2,
    borderLeftWidth: 2,
    paddingHorizontal: 3,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  timelineEventTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  timelineEventTime: {
    fontSize: 8,
    color: Colors.white + 'CC',
    marginTop: 0,
  },
});
