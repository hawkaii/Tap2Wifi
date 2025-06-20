export const rewardService = {
  getAvailableRewards() {
    return [
      {
        id: '1',
        title: '10% Off Coffee',
        description: 'Get 10% discount at partner cafes',
        points: 50,
        category: 'Food & Drink',
        partner: 'Local Cafe Chain',
        image: 'https://via.placeholder.com/100x100?text=Coffee',
      },
      {
        id: '2',
        title: 'Free WiFi Hour',
        description: '1 hour of premium WiFi access',
        points: 30,
        category: 'Connectivity',
        partner: 'WiFi Plus',
        image: 'https://via.placeholder.com/100x100?text=WiFi',
      },
      {
        id: '3',
        title: '$5 Store Credit',
        description: '$5 credit at partner stores',
        points: 100,
        category: 'Shopping',
        partner: 'Tech Store',
        image: 'https://via.placeholder.com/100x100?text=Store',
      },
      {
        id: '4',
        title: 'Premium Account',
        description: '1 month premium features',
        points: 200,
        category: 'Premium',
        partner: 'WiFi Share App',
        image: 'https://via.placeholder.com/100x100?text=Premium',
      },
    ];
  },

  async redeemReward(rewardId, userPoints) {
    const rewards = this.getAvailableRewards();
    const reward = rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      throw new Error('Reward not found');
    }
    
    if (userPoints < reward.points) {
      throw new Error('Insufficient points');
    }
    
    // TODO: Process redemption with backend
    return {
      success: true,
      message: `Successfully redeemed ${reward.title}!`,
      reward,
    };
  },
};
