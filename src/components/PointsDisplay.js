import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function PointsDisplay({ points, level, detailed = false }) {
  const getLevelColor = (level) => {
    const colors = {
      Bronze: '#CD7F32',
      Silver: '#C0C0C0',
      Gold: '#FFD700',
      Platinum: '#E5E4E2',
    };
    return colors[level] || '#CD7F32';
  };

  const getLevelIcon = (level) => {
    return level === 'Platinum' ? 'workspace-premium' : 'military-tech';
  };

  if (detailed) {
    return (
      <View style={styles.detailedContainer}>
        <View style={styles.pointsSection}>
          <Icon name="stars" size={32} color="#FF9500" />
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsNumber}>{points}</Text>
            <Text style={styles.pointsLabel}>Points</Text>
          </View>
        </View>
        
        <View style={styles.levelSection}>
          <Icon 
            name={getLevelIcon(level)} 
            size={24} 
            color={getLevelColor(level)} 
          />
          <Text style={[styles.levelText, { color: getLevelColor(level) }]}>
            {level}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pointsContainer}>
        <Icon name="stars" size={16} color="#FF9500" />
        <Text style={styles.points}>{points}</Text>
      </View>
      
      <View style={styles.levelContainer}>
        <Icon 
          name={getLevelIcon(level)} 
          size={14} 
          color={getLevelColor(level)} 
        />
        <Text style={[styles.level, { color: getLevelColor(level) }]}>
          {level}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  points: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  level: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  pointsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsInfo: {
    marginLeft: 12,
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  levelText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});