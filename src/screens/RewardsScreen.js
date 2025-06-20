import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../context/UserContext';
import { rewardService } from '../services/rewardService';

export default function RewardsScreen() {
  const { user, redeemPoints } = useUser();
  const [rewards] = useState(rewardService.getAvailableRewards());
  const [redeeming, setRedeeming] = useState(null);

  const handleRedeem = async (reward) => {
    if (user.points < reward.points) {
      Alert.alert(
        'Insufficient Points',
        `You need ${reward.points - user.points} more points to redeem this reward.`
      );
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Are you sure you want to redeem "${reward.title}" for ${reward.points} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: async () => {
            setRedeeming(reward.id);
            try {
              const result = await rewardService.redeemReward(reward.id, user.points);
              if (result.success) {
                redeemPoints(reward.points);
                Alert.alert('Success!', result.message);
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setRedeeming(null);
            }
          },
        },
      ]
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Drink': '#FF6B6B',
      'Connectivity': '#4ECDC4',
      'Shopping': '#45B7D1',
      'Premium': '#96CEB4',
    };
    return colors[category] || '#999';
  };

  const renderReward = ({ item }) => (
    <View style={styles.rewardCard}>
      <View style={styles.rewardHeader}>
        <Image source={{ uri: item.image }} style={styles.rewardImage} />
        <View style={styles.rewardInfo}>
          <Text style={styles.rewardTitle}>{item.title}</Text>
          <Text style={styles.rewardDescription}>{item.description}</Text>
          <Text style={styles.rewardPartner}>by {item.partner}</Text>
          
          <View style={styles.rewardMeta}>
            <View 
              style={[
                styles.categoryBadge, 
                { backgroundColor: getCategoryColor(item.category) }
              ]}
            >
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <View style={styles.pointsRequired}>
              <Icon name="stars" size={16} color="#FF9500" />
              <Text style={styles.pointsText}>{item.points} points</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.redeemButton,
          user.points < item.points && styles.disabledButton,
          redeeming === item.id && styles.loadingButton,
        ]}
        onPress={() => handleRedeem(item)}
        disabled={user.points < item.points || redeeming === item.id}
      >
        {redeeming === item.id ? (
          <Text style={styles.buttonText}>Redeeming...</Text>
        ) : user.points < item.points ? (
          <Text style={[styles.buttonText, styles.disabledText]}>
            Need {item.points - user.points} more points
          </Text>
        ) : (
          <>
            <Icon name="redeem" size={16} color="#fff" />
            <Text style={styles.buttonText}>Redeem</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <View style={styles.pointsBalance}>
          <Icon name="stars" size={20} color="#FF9500" />
          <Text style={styles.balanceText}>{user.points} points</Text>
        </View>
      </View>

      {/* Rewards List */}
      <FlatList
        data={rewards}
        renderItem={renderReward}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.infoCard}>
            <Icon name="info" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Earn points by sharing WiFi spots and redeem them for exclusive rewards!
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="redeem" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No rewards available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new rewards!
            </Text>
          </View>
        }
      />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pointsBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  balanceText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  listContainer: {
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: '#1565c0',
    fontSize: 14,
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  rewardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  rewardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rewardPartner: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  rewardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  pointsRequired: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9500',
  },
  redeemButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loadingButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  disabledText: {
    color: '#999',
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
});
