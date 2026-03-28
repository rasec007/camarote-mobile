import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { AgendaEvent } from '../data/mockEvents';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';

dayjs.locale('pt-br');

const categoryLabels: Record<string, string> = {
  meeting: 'Reunião',
  show: 'Show',
  vip: 'VIP',
  rehearsal: 'Ensaio',
  external: 'Externo',
  staff: 'Staff',
  maintenance: 'Manutenção',
};

const categoryIcons: Record<string, string> = {
  meeting: '🤝',
  show: '🎤',
  vip: '⭐',
  rehearsal: '🎭',
  external: '🌐',
  staff: '👥',
  maintenance: '🔧',
};

interface EventCardProps {
  event: AgendaEvent;
  compact?: boolean;
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const color = Colors.eventColors[event.category] ?? Colors.primary;

  if (compact) {
    return (
      <View style={[styles.compactCard, { borderLeftColor: color }]}>
        <Text style={styles.compactTime}>
          {event.startTime}
        </Text>
        <View style={[styles.compactDot, { backgroundColor: color }]} />
        <Text style={styles.compactTitle} numberOfLines={1}>
          {event.title}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardLeft}>
        <View style={[styles.categoryBadge, { backgroundColor: color + '22' }]}>
          <Text style={styles.categoryIcon}>{categoryIcons[event.category]}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{event.title}</Text>
          <View style={[styles.categoryTag, { backgroundColor: color + '33' }]}>
            <Text style={[styles.categoryTagText, { color }]}>
              {categoryLabels[event.category]}
            </Text>
          </View>
        </View>
        {event.description && (
          <Text style={styles.cardDesc} numberOfLines={1}>{event.description}</Text>
        )}
        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>🕐 {event.startTime} – {event.endTime}</Text>
          {event.location && (
            <Text style={styles.metaText}>📍 {event.location}</Text>
          )}
        </View>
        {event.attendees && event.attendees.length > 0 && (
          <Text style={styles.attendees} numberOfLines={1}>
            👤 {event.attendees.join(' · ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLeft: {
    padding: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    width: 52,
    backgroundColor: Colors.background,
  },
  categoryBadge: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 18,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
    marginRight: Spacing.xs,
  },
  categoryTag: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
  },
  categoryTagText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  attendees: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },

  // Compact (usado na timeline)
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginBottom: 2,
    borderLeftWidth: 2,
    gap: 2,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  compactTime: {
    fontSize: 8,
    color: Colors.text.secondary,
    width: 25,
  },
  compactDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  compactTitle: {
    fontSize: 9,
    color: Colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },
});
