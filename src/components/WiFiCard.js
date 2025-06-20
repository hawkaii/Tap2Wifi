import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function WiFiCard({ spot, onPress }) {
  const getSpeedColor = (speed) => {
    switch (speed?.toLowerCase()) {
      case 'high': return '#34C759';
      case 'medium': return '#FF9500';
      case 'low': return '#FF3B30';
      default: return '#666';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'business' ? 'business' : 'public';
  };

  const formatDistance = (distance) => {
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  // Mock distance calculation
  const mockDistance = Math.floor(Math.random() * 500) + 50;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{spot.name}</Text>
          <Text style={styles.location}>{spot.location.name}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.typeIndicator}>
            <Icon name={getTypeIcon(spot.type)} size={14} color="#007AFF" />
            <Text style={styles.typeText}>{spot.type}</Text>
          </View>
          {spot.verified && (
            <Icon name="verified" size={16} color="#34C759" />
          )}
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Icon name="signal-wifi-4-bar" size={16} color={getSpeedColor(spot.speed)} />
          <Text style={[styles.detailText, { color: getSpeedColor(spot.speed) }]}>
            {spot.speed}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Icon name="star" size={16} color="#FF9500" />
          <Text style={styles.detailText}>{spot.quality}/5</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.detailText}>{formatDistance(mockDistance)}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Icon name="category" size={16} color="#666" />
          <Text style={styles.detailText}>{spot.category}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.votes}>
          <View style={styles.voteItem}>
            <Icon name="thumb-up" size={14} color="#34C759" />
            <Text style={styles.voteText}>{spot.upvotes}</Text>
          </View>
          <View style={styles.voteItem}>
            <Icon name="thumb-down" size={14} color="#FF3B30" />
            <Text style={styles.voteText}>{spot.downvotes}</Text>
          </View>
        </View>
        
        {spot.openHours && (
          <Text style={styles.hours}>{spot.openHours}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  typeText: {
    marginLeft: 4,
    color: '#007AFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  votes: {
    flexDirection: 'row',
  },
  voteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  voteText: {
    marginLeft: 2,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  hours: {
    fontSize: 10,
    color: '#999',
  },
});