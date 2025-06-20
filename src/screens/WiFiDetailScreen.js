import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Clipboard,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { wifiService } from '../services/wifiService';

export default function WiFiDetailScreen({ route, navigation }) {
  const { spot } = route.params;
  const [userVote, setUserVote] = useState(null);

  const handleVote = async (voteType) => {
    try {
      await wifiService.voteOnSpot(spot.id, voteType);
      setUserVote(voteType);
      Alert.alert('Success', 'Thank you for your feedback!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
    }
  };

  const copyPassword = () => {
    Clipboard.setString(spot.password);
    Alert.alert('Copied!', 'Password copied to clipboard');
  };

  const getSpeedColor = (speed) => {
    switch (speed.toLowerCase()) {
      case 'high': return '#34C759';
      case 'medium': return '#FF9500';
      case 'low': return '#FF3B30';
      default: return '#666';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'business' ? 'business' : 'public';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerInfo}>
              <Text style={styles.wifiName}>{spot.name}</Text>
              <Text style={styles.locationName}>{spot.location.name}</Text>
              <Text style={styles.address}>{spot.location.address}</Text>
            </View>
            <View style={styles.typeIndicator}>
              <Icon 
                name={getTypeIcon(spot.type)} 
                size={20} 
                color="#007AFF" 
              />
              <Text style={styles.typeText}>{spot.type}</Text>
            </View>
          </View>

          {spot.verified && (
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={16} color="#34C759" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="lock" size={20} color="#666" />
            <Text style={styles.sectionTitle}>Password</Text>
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.password}>{spot.password}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyPassword}>
              <Icon name="content-copy" size={16} color="#007AFF" />
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* WiFi Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WiFi Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Icon name="signal-wifi-4-bar" size={20} color={getSpeedColor(spot.speed)} />
              <Text style={styles.infoLabel}>Speed</Text>
              <Text style={[styles.infoValue, { color: getSpeedColor(spot.speed) }]}>
                {spot.speed}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="star" size={20} color="#FF9500" />
              <Text style={styles.infoLabel}>Quality</Text>
              <Text style={styles.infoValue}>{spot.quality}/5</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="category" size={20} color="#666" />
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{spot.category}</Text>
            </View>
          </View>
        </View>

        {/* Hours */}
        {spot.openHours && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="schedule" size={20} color="#666" />
              <Text style={styles.sectionTitle}>Hours</Text>
            </View>
            <Text style={styles.hoursText}>{spot.openHours}</Text>
          </View>
        )}

        {/* Description */}
        {spot.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{spot.description}</Text>
          </View>
        )}

        {/* Community Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Feedback</Text>
          <View style={styles.votingContainer}>
            <View style={styles.voteStats}>
              <View style={styles.voteStat}>
                <Icon name="thumb-up" size={16} color="#34C759" />
                <Text style={styles.voteCount}>{spot.upvotes}</Text>
              </View>
              <View style={styles.voteStat}>
                <Icon name="thumb-down" size={16} color="#FF3B30" />
                <Text style={styles.voteCount}>{spot.downvotes}</Text>
              </View>
            </View>
            
            <View style={styles.voteButtons}>
              <TouchableOpacity
                style={[
                  styles.voteButton,
                  userVote === 'up' && styles.activeUpvote,
                ]}
                onPress={() => handleVote('up')}
              >
                <Icon 
                  name="thumb-up" 
                  size={16} 
                  color={userVote === 'up' ? '#fff' : '#34C759'} 
                />
                <Text style={[
                  styles.voteButtonText,
                  userVote === 'up' && styles.activeVoteText,
                ]}>
                  Helpful
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.voteButton,
                  userVote === 'down' && styles.activeDownvote,
                ]}
                onPress={() => handleVote('down')}
              >
                <Icon 
                  name="thumb-down" 
                  size={16} 
                  color={userVote === 'down' ? '#fff' : '#FF3B30'} 
                />
                <Text style={[
                  styles.voteButtonText,
                  userVote === 'down' && styles.activeVoteText,
                ]}>
                  Not Helpful
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="directions" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
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
  headerCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
  },
  wifiName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    marginLeft: 4,
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  verifiedText: {
    marginLeft: 4,
    color: '#34C759',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  password: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 2,
  },
  hoursText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  votingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteStats: {
    flexDirection: 'row',
  },
  voteStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  voteCount: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  voteButtons: {
    flexDirection: 'row',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginLeft: 8,
  },
  activeUpvote: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  activeDownvote: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  voteButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeVoteText: {
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontWeight: '600',
  },
});
