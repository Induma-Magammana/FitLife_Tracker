import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, setUser } from '../store/slices/authSlice';
import { StorageService } from '../services/storageService';
import { useTheme } from '../contexts/ThemeContext';

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const favourites = useAppSelector((state) => state.favourites.favourites);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  // Modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  // Edit profile form states
  const [editedFirstName, setEditedFirstName] = useState(user?.firstName || '');
  const [editedLastName, setEditedLastName] = useState(user?.lastName || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedBio, setEditedBio] = useState('');

  // Notification settings states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setEditedFirstName(user.firstName || '');
      setEditedLastName(user.lastName || '');
      setEditedEmail(user.email || '');
    }
  }, [user]);

  // Privacy settings states
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showEmail, setShowEmail] = useState(false);

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAll();
            dispatch(logout());
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveProfile = async () => {
    try {
      // Create updated user object
      const updatedUser = {
        ...user,
        firstName: editedFirstName,
        lastName: editedLastName,
        email: editedEmail,
      };

      // Update Redux store
      dispatch(setUser(updatedUser));

      // Save to AsyncStorage
      await StorageService.saveUserData(updatedUser);

      // TODO: Update user profile in backend
      // await apiService.updateProfile(updatedUser);

      Alert.alert('Success', 'Profile updated successfully!');
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setEditedFirstName(user?.firstName || '');
    setEditedLastName(user?.lastName || '');
    setEditedEmail(user?.email || '');
    setEditedPhone('');
    setEditedBio('');
    setEditModalVisible(false);
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Text>
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{favourites.length}</Text>
          <Text style={styles.statLabel}>Favourites</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Days Active</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setEditModalVisible(true)}>
          <Text style={styles.menuItemText}>Edit Profile</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setNotificationModalVisible(true)}>
          <Text style={styles.menuItemText}>Notifications</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setPrivacyModalVisible(true)}>
          <Text style={styles.menuItemText}>Privacy</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
          <Text style={styles.menuItemText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setLanguageModalVisible(true)}>
          <Text style={styles.menuItemText}>Language</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setHelpModalVisible(true)}>
          <Text style={styles.menuItemText}>Help Center</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Terms of Service</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Privacy Policy</Text>
          <Text style={styles.menuItemIcon}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editedFirstName}
                    onChangeText={setEditedFirstName}
                    placeholder="Enter first name"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editedLastName}
                    onChangeText={setEditedLastName}
                    placeholder="Enter last name"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={editedEmail}
                    onChangeText={setEditedEmail}
                    placeholder="Enter email"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={editedPhone}
                    onChangeText={setEditedPhone}
                    placeholder="Enter phone number"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bio</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editedBio}
                    onChangeText={setEditedBio}
                    placeholder="Tell us about yourself"
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={notificationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Settings</Text>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.settingItem}>
                <View>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive push notifications on your device
                  </Text>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingItem}>
                <View>
                  <Text style={styles.settingTitle}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive updates via email
                  </Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingItem}>
                <View>
                  <Text style={styles.settingTitle}>Workout Reminders</Text>
                  <Text style={styles.settingDescription}>
                    Get reminders for your scheduled workouts
                  </Text>
                </View>
                <Switch
                  value={workoutReminders}
                  onValueChange={setWorkoutReminders}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.fullWidthButton} 
                onPress={() => setNotificationModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        visible={privacyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Settings</Text>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.settingTitle}>Profile Visibility</Text>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setProfileVisibility('public')}
              >
                <View style={styles.radioCircle}>
                  {profileVisibility === 'public' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Public</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setProfileVisibility('friends')}
              >
                <View style={styles.radioCircle}>
                  {profileVisibility === 'friends' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Friends Only</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setProfileVisibility('private')}
              >
                <View style={styles.radioCircle}>
                  {profileVisibility === 'private' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Private</Text>
              </TouchableOpacity>

              <View style={styles.settingItem}>
                <View>
                  <Text style={styles.settingTitle}>Show Email Address</Text>
                  <Text style={styles.settingDescription}>
                    Display your email on your profile
                  </Text>
                </View>
                <Switch
                  value={showEmail}
                  onValueChange={setShowEmail}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <Text style={styles.noteText}>
                Note: Your privacy settings affect how other users can view and interact with your profile.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.fullWidthButton} 
                onPress={() => setPrivacyModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
            </View>

            <ScrollView style={styles.modalBody}>
              {['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={styles.languageOption}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <Text style={styles.languageText}>{lang}</Text>
                  {selectedLanguage === lang && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.fullWidthButton} 
                onPress={() => setLanguageModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Help Center Modal */}
      <Modal
        visible={helpModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help Center</Text>
            </View>

            <ScrollView style={styles.modalBody}>
              <TouchableOpacity style={styles.helpItem}>
                <Text style={styles.helpIcon}>📚</Text>
                <View style={styles.helpInfo}>
                  <Text style={styles.helpTitle}>User Guide</Text>
                  <Text style={styles.helpDescription}>Learn how to use the app</Text>
                </View>
                <Text style={styles.helpArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.helpItem}>
                <Text style={styles.helpIcon}>❓</Text>
                <View style={styles.helpInfo}>
                  <Text style={styles.helpTitle}>FAQs</Text>
                  <Text style={styles.helpDescription}>Frequently asked questions</Text>
                </View>
                <Text style={styles.helpArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.helpItem}>
                <Text style={styles.helpIcon}>💬</Text>
                <View style={styles.helpInfo}>
                  <Text style={styles.helpTitle}>Contact Support</Text>
                  <Text style={styles.helpDescription}>Get help from our team</Text>
                </View>
                <Text style={styles.helpArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.helpItem}>
                <Text style={styles.helpIcon}>🐛</Text>
                <View style={styles.helpInfo}>
                  <Text style={styles.helpTitle}>Report a Bug</Text>
                  <Text style={styles.helpDescription}>Help us improve the app</Text>
                </View>
                <Text style={styles.helpArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.versionInfo}>
                <Text style={styles.versionInfoText}>App Version: 1.0.0</Text>
                <Text style={styles.versionInfoText}>Build: 2024.11.24</Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.fullWidthButton} 
                onPress={() => setHelpModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.surface,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    backgroundColor: theme.cardBackground,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.text,
  },
  menuItemIcon: {
    fontSize: 24,
    color: theme.textSecondary,
  },
  logoutButton: {
    backgroundColor: theme.error,
    margin: 16,
    marginTop: 32,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: theme.textSecondary,
    fontSize: 12,
    paddingBottom: 24,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.background,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
  },
  modalBody: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    maxWidth: '80%',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: theme.text,
  },
  noteText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontStyle: 'italic',
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.surface,
    borderRadius: 8,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  languageText: {
    fontSize: 16,
    color: theme.text,
  },
  checkmark: {
    fontSize: 20,
    color: theme.primary,
    fontWeight: 'bold',
  },
  fullWidthButton: {
    flex: 1,
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  helpIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  helpInfo: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  helpArrow: {
    fontSize: 24,
    color: theme.textSecondary,
  },
  versionInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: theme.surface,
    borderRadius: 8,
    alignItems: 'center',
  },
  versionInfoText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },
});
