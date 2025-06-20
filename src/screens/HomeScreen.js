import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWiFi } from '../context/WiFiContext';
import { useUser } from '../context/UserContext';
import WiFiCard from '../components/WiFiCard';
import PointsDisplay from '../components/PointsDisplay';

export default function HomeScreen({ navigation }) {
  const { nearbySpots, loading } = useWiFi();
  const { user } = useUser();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user.name}!</Text>
            <Text style={styles.subtitle}>Find WiFi spots near you</Text>
          </View>
          <PointsDisplay points={user.points} level={user.level} />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="wifi" size={24} color="#007AFF" />
            <Text style={styles.statNumber}>{nearbySpots.length}</Text>
            <Text style={styles.statLabel}>Nearby Spots</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="share" size={24} color="#34C759" />
            <Text style={styles.statNumber}>{user.contributedSpots}</Text>
            <Text style={styles.statLabel}>Contributed</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="stars" size={24} color="#FF9500" />
            <Text style={styles.statNumber}>{user.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Add')}
          >
            <Icon name="add-circle" size={24} color="#fff" />
            <Text style={styles.actionText}>Share WiFi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => navigation.navigate('Profile', { screen: 'Rewards' })}
          >
            <Icon name="redeem" size={24} color="#007AFF" />
            <Text style={[styles.actionText, styles.secondaryActionText]}>
              Rewards
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nearby WiFi Spots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby WiFi Spots</Text>
            <TouchableOpacity onPress={() => navigation.navigate('WiFi')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading nearby spots...</Text>
            </View>
          ) : nearbySpots.length > 0 ? (
            nearbySpots.slice(0, 3).map((spot) => (
              <WiFiCard
                key={spot.id}
                spot={spot}
                onPress={() =>
                  navigation.navigate('WiFi', {
                    screen: 'WiFiDetail',
                    params: { spot },
                  })
                }
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="wifi-off" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No WiFi spots found nearby</Text>
              <Text style={styles.emptySubtext}>
                Be the first to share a WiFi spot in this area!
              </Text>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Pro Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Earn 10 points for each WiFi spot you share!
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Verify spots by voting to help the community.
            </Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginRight: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  secondaryAction: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryActionText: {
    color: '#007AFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  seeAll: {
    color: '#007AFF',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  tipText: {
    color: '#333',
    fontSize: 14,
  },
});