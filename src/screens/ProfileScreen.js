import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext';
import PointsDisplay from '../components/PointsDisplay';

export default function ProfileScreen({ navigation }) {
  const { user } = useUser();

  const getLevelProgress = () => {
    const levels = {
      Bronze: { min: 0, max: 100 },
      Silver: { min: 100, max: 300 },
      Gold: { min: 300, max: 600 },
      Platinum: { min: 600, max: 1000 },
    };
    
    const currentLevel = levels[user.level] || levels.Bronze;
    const progress = ((user.points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getNextLevel = () => {
    const levels = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    const currentIndex = levels.indexOf(user.level);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const achievements = [
    {
      id: 1,
      title: 'First Share',
      description: 'Shared your first WiFi spot',
      icon: 'share',
      earned: user.contributedSpots > 0,
      color: '#34C759',
    },
    {
      id: 2,
      title: 'Community Helper',
      description: 'Shared 5 WiFi spots',
      icon: 'group',
      earned: user.contributedSpots >= 5,
      color: '#007AFF',
    },
    {
      id: 3,
      title: 'Points Collector',
      description: 'Earned 100 points',
      icon: 'stars',
      earned: user.points >= 100,
      color: '#FF9500',
    },
    {
      id: 4,
      title: 'Silver Member',
      description: 'Reached Silver level',
      icon: 'military-tech',
      earned: user.level !== 'Bronze',
      color: '#C0C0C0',
    },
  ];

  const menuItems = [
    {
      icon: 'redeem',
      title: 'Rewards',
      subtitle: 'Redeem your points',
      onPress: () => navigation.navigate('Rewards'),
    },
    {
      icon: 'history',
      title: 'My Contributions',
      subtitle: 'WiFi spots you\'ve shared',
      onPress: () => {},
    },
    {
      icon: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      onPress: () => {},
    },
    {
      icon: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      onPress: () => {},
    },
    {
      icon: 'info',
      title: 'About',
      subtitle: 'App version and info',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Icon name="person" size={40} color="#007AFF" />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.joinDate}>
            Member since {new Date(user.joinedDate).toLocaleDateString()}
          </Text>
        </View>

        {/* Points & Level */}
        <View style={styles.section}>
          <PointsDisplay points={user.points} level={user.level} detailed />
          
          {/* Level Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress to {getNextLevel() || 'Max Level'}</Text>
              <Text style={styles.progressPercent}>{Math.round(getLevelProgress())}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${getLevelProgress()}%` }]} 
              />
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="share" size={24} color="#34C759" />
              <Text style={styles.statNumber}>{user.contributedSpots}</Text>
              <Text style={styles.statLabel}>WiFi Spots Shared</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="stars" size={24} color="#FF9500" />
              <Text style={styles.statNumber}>{user.points}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="military-tech" size={24} color="#007AFF" />
              <Text style={styles.statNumber}>{user.level}</Text>
              <Text style={styles.statLabel}>Current Level</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.earned && styles.lockedAchievement,
                ]}
              >
                <Icon
                  name={achievement.icon}
                  size={24}
                  color={achievement.earned ? achievement.color : '#ccc'}
                />
                <View style={styles.achievementInfo}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !achievement.earned && styles.lockedText,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                  <Text
                    style={[
                      styles.achievementDescription,
                      !achievement.earned && styles.lockedText,
                    ]}
                  >
                    {achievement.description}
                  </Text>
                </View>
                {achievement.earned && (
                  <Icon name="check-circle" size={20} color="#34C759" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Icon name={item.icon} size={24} color="#007AFF" />
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  lockedText: {
    color: '#999',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});