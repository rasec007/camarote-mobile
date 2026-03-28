import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { mockEvents, AgendaEvent } from '../data/mockEvents';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';

// Configuração de idioma para o calendário
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

dayjs.locale('pt-br');

interface MonthlyViewProps {
  selectedDate: string;
  currentMonth: dayjs.Dayjs;
  onDayPress: (date: string) => void;
  events: any[];
  zoomScale: number;
}

// Componente customizado para cada dia do calendário
const CustomDay = ({ date, state, marking, onPress, zoomScale, events }: any) => {
  const dateStr = date.dateString;
  const isSelected = marking?.selected;
  const isToday = dayjs().format('YYYY-MM-DD') === dateStr;
  const isDisabled = state === 'disabled';
  
  // Buscar eventos para este dia
  const dayEvents = useMemo(() => 
    events.filter(e => e.date === dateStr).slice(0, 4)
  , [dateStr, events]);

  const cellHeight = 80 * zoomScale;
  const blockHeight = 14 * zoomScale;
  const blockFontSize = Math.max(7, 9 * zoomScale);

  return (
    <TouchableOpacity 
      style={[
        styles.dayContainer, 
        isSelected && styles.selectedDay,
        isDisabled && styles.disabledDay,
        { height: cellHeight }
      ]}
      onPress={() => onPress(date)}
    >
      <View style={styles.dayHeader}>
        <Text style={[
          styles.dayText, 
          isSelected && styles.selectedDayText,
          isToday && styles.todayText,
          isDisabled && styles.disabledDayText
        ]}>
          {date.day}
        </Text>
      </View>
      
      <View style={styles.eventBlocks}>
        {dayEvents.map((event, idx) => (
          <View 
            key={event.id} 
            style={[
              styles.eventBlock, 
              { 
                backgroundColor: (Colors.eventColors[event.category] || Colors.primary) + 'EE',
                height: blockHeight
              }
            ]}
          >
            <Text style={[styles.eventBlockText, { fontSize: blockFontSize }]} numberOfLines={1}>
              {event.title}
            </Text>
          </View>
        ))}
        {dayEvents.length === 4 && (
          <Text style={styles.moreText}>...</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export function MonthlyView({ selectedDate, currentMonth, onDayPress, events, zoomScale }: MonthlyViewProps) {
  const markedDates = useMemo(() => ({
    [selectedDate]: { selected: true }
  }), [selectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        key={currentMonth.format('YYYY-MM') + zoomScale} // Força re-render no zoom também
        current={currentMonth.format('YYYY-MM-DD')}
        onDayPress={(day: { dateString: string }) => onDayPress(day.dateString)}
        markedDates={markedDates}
        dayComponent={({ date, state, marking }: any) => (
          <CustomDay 
            date={date} 
            state={state} 
            marking={marking} 
            zoomScale={zoomScale}
            events={events}
            onPress={(d: any) => onDayPress(d.dateString)} 
          />
        )}
        theme={{
          backgroundColor: Colors.surface,
          calendarBackground: Colors.surface,
          textSectionTitleColor: Colors.text.secondary,
          selectedDayBackgroundColor: Colors.selected,
          selectedDayTextColor: Colors.white,
          todayTextColor: Colors.today,
          dayTextColor: Colors.text.primary,
          textDisabledColor: Colors.text.muted,
          monthTextColor: Colors.text.primary,
          textMonthFontWeight: '700',
          textDayHeaderFontSize: 12,
          textDayHeaderFontWeight: '600',
        }}
        style={styles.calendar}
        hideArrows={true}
        enableSwipeMonths={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  calendar: {
    paddingBottom: Spacing.md,
  },
  dayContainer: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: 1,
    backgroundColor: Colors.surface,
  },
  selectedDay: {
    backgroundColor: Colors.primary + '11',
    borderColor: Colors.primary,
  },
  disabledDay: {
    backgroundColor: Colors.background,
  },
  dayHeader: {
    alignItems: 'flex-end',
    marginBottom: 1,
  },
  dayText: {
    fontSize: 10,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  selectedDayText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  todayText: {
    color: Colors.today,
    fontWeight: '700',
  },
  disabledDayText: {
    color: Colors.text.muted,
  },
  eventBlocks: {
    flex: 1,
    gap: 1,
  },
  eventBlock: {
    borderRadius: 2,
    paddingHorizontal: 2,
    paddingVertical: 0,
    justifyContent: 'center',
  },
  eventBlockText: {
    color: Colors.white,
    fontWeight: '600',
  },
  moreText: {
    fontSize: 8,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 8,
  },
});
