import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWiFi } from '../context/WiFiContext';
import { useUser } from '../context/UserContext';

export default function AddWiFiScreen({ navigation }) {
  const { addWiFiSpot } = useWiFi();
  const { addPoints } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    locationName: '',
    address: '',
    type: 'business',
    category: '',
    speed: 'medium',
    description: '',
    openHours: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'WiFi network name is required');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'WiFi password is required');
      return false;
    }
    if (!formData.locationName.trim()) {
      Alert.alert('Error', 'Location name is required');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Address is required');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Error', 'Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const wifiData = {
        ...formData,
        location: {
          name: formData.locationName,
          address: formData.address,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.1, // Mock coordinates
          longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
        },
        quality: 4.0, // Default quality
        upvotes: 0,
        downvotes: 0,
        verified: false,
      };

      await addWiFiSpot(wifiData);
      addPoints(10); // Award points for sharing
      
      Alert.alert(
        'Success!',
        'WiFi spot shared successfully! You earned 10 points.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                name: '',
                password: '',
                locationName: '',
                address: '',
                type: 'business',
                category: '',
                speed: 'medium',
                description: '',
                openHours: '',
              });
              navigation.navigate('Home');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to share WiFi spot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: 'business', label: 'Business' },
    { value: 'public', label: 'Public' },
  ];

  const speedOptions = [
    { value: 'high', label: 'High Speed' },
    { value: 'medium', label: 'Medium Speed' },
    { value: 'low', label: 'Low Speed' },
  ];

  const categoryOptions = [
    'Cafe', 'Restaurant', 'Library', 'Hotel', 'Shopping Mall',
    'Park', 'Airport', 'Hospital', 'University', 'Co-working Space',
    'Other'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Share WiFi Spot</Text>
          <Text style={styles.subtitle}>
            Help others connect and earn 10 points!
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* WiFi Network Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>WiFi Network Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter WiFi network name"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>WiFi Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter WiFi password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry={false}
            />
          </View>

          {/* Location Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Starbucks Downtown"
              value={formData.locationName}
              onChangeText={(value) => updateField('locationName', value)}
            />
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full address"
              value={formData.address}
              onChangeText={(value) => updateField('address', value)}
              multiline
            />
          </View>

          {/* Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type *</Text>
            <View style={styles.optionContainer}>
              {typeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData.type === option.value && styles.selectedOption,
                  ]}
                  onPress={() => updateField('type', option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.type === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categoryOptions.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    formData.category === category && styles.selectedCategory,
                  ]}
                  onPress={() => updateField('category', category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === category && styles.selectedCategoryText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Speed */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Connection Speed</Text>
            <View style={styles.optionContainer}>
              {speedOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData.speed === option.value && styles.selectedOption,
                  ]}
                  onPress={() => updateField('speed', option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.speed === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Operating Hours */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Operating Hours</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 7:00 AM - 10:00 PM"
              value={formData.openHours}
              onChangeText={(value) => updateField('openHours', value)}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional information about this WiFi spot..."
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Points Info */}
          <View style={styles.pointsInfo}>
            <Icon name="stars" size={20} color="#FF9500" />
            <Text style={styles.pointsText}>
              You'll earn 10 points for sharing this WiFi spot!
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Icon name="share" size={20} color="#fff" />
            <Text style={styles.submitText}>
              {isSubmitting ? 'Sharing...' : 'Share WiFi Spot'}
            </Text>
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  pointsText: {
    marginLeft: 8,
    color: '#856404',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});