import type { ReactNode } from 'react';
import { useCallback } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { useBackHandler } from '@/navigators';
import { navigationActions } from '@/store/actions/navigation';
import type { AppDispatch } from '@/store';
import { useAuth } from '@/auth/AuthContext';
import { resetUserData } from '@/firestore';
import { showToast } from '@/utils/toast';

const FIREBASE_PRIVACY_URL = 'https://firebase.google.com/support/privacy';
const GOOGLE_PRIVACY_URL = 'https://policies.google.com/privacy';
const GOOGLE_TERMS_URL = 'https://policies.google.com/terms';

const PrivacyAndSecurityScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user } = useAuth();

  const handleBack = () => dispatch(navigationActions.toBack());
  useBackHandler({ onBack: handleBack });

  const openUrl = useCallback(async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      showToast.error("Couldn't open link", 'Please try again later.');
    }
  }, []);

  const openAppSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch {
      showToast.error(
        "Couldn't open Settings",
        'Open Settings manually from your device.',
      );
    }
  }, []);

  const handleDeleteData = useCallback(() => {
    if (!user?.uid) {
      showToast.info('Sign in required', 'Please sign in to manage your data.');
      return;
    }

    Alert.alert(
      'Delete your saved data?',
      'This will remove your saved profile and preferences. You will stay signed in.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            resetUserData(user.uid)
              .then(() => {
                showToast.success(
                  'Data deleted',
                  'Your saved data was removed.',
                );
              })
              .catch(() => {
                showToast.error("Couldn't delete data", 'Please try again.');
              });
          },
        },
      ],
    );
  }, [user?.uid]);

  const SectionTitle = ({ children }: { children: ReactNode }) => (
    <Text
      className="text-xs font-bold uppercase tracking-wider mt-6 mb-2"
      style={{ color: theme.grey }}>
      {children}
    </Text>
  );

  const Card = ({
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle?: string;
    children: ReactNode;
  }) => (
    <View
      className="border rounded-2xl p-4 mb-3"
      style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
      <Text className="text-[15px] font-bold" style={{ color: theme.white }}>
        {title}
      </Text>
      {subtitle && (
        <Text className="text-xs mt-1" style={{ color: theme.grey }}>
          {subtitle}
        </Text>
      )}
      <View className="mt-3 gap-2">{children}</View>
    </View>
  );

  const Row = ({
    icon,
    title,
    subtitle,
    onPress,
    disabled,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      className="flex-row items-center"
      activeOpacity={onPress && !disabled ? 0.85 : 1}
      onPress={onPress}
      disabled={!onPress || disabled}>
      <View
        className="w-11 h-11 rounded-xl border justify-center items-center mr-3.5"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.darkBg,
          opacity: disabled ? 0.6 : 1,
        }}>
        <Ionicons name={icon as any} size={20} color={theme.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-[14px] font-bold" style={{ color: theme.white }}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-xs mt-0.5" style={{ color: theme.grey }}>
            {subtitle}
          </Text>
        )}
      </View>
      {onPress && !disabled && (
        <Ionicons name="chevron-forward" size={18} color={theme.tabInactive} />
      )}
    </TouchableOpacity>
  );

  const Bullet = ({ children }: { children: ReactNode }) => (
    <View className="flex-row items-start">
      <Text style={{ color: theme.grey, marginRight: 8 }}>•</Text>
      <Text className="text-xs flex-1" style={{ color: theme.grey }}>
        {children}
      </Text>
    </View>
  );

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: theme.screenBg }}>
      <TouchableOpacity
        className="flex-row items-center px-4 pt-4 pb-2"
        onPress={handleBack}
        activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={24} color={theme.white} />
        <Text className="text-base ml-2" style={{ color: theme.white }}>
          Back
        </Text>
      </TouchableOpacity>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 56,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text
          className="text-3xl font-extrabold tracking-tight mt-6"
          style={{ color: theme.white }}>
          Privacy & security
        </Text>
        <Text className="text-[13px] mt-1" style={{ color: theme.grey }}>
          This page explains what information is stored and how to keep your
          account safe.
        </Text>

        <SectionTitle>Data</SectionTitle>
        <Card
          title="What we store"
          subtitle="Saved to your account so you can pick up where you left off">
          <Bullet>
            Profile details you enter (e.g. city/area, age, emergency contacts,
            blood group, medical notes).
          </Bullet>
          <Bullet>
            Preferences you set in the app (voice, vision, accessibility
            settings).
          </Bullet>
          <Bullet>
            Sign-in identifiers provided by your login method (Google/email).
          </Bullet>
        </Card>

        <Card title="How it’s used" subtitle="To personalize your experience">
          <Bullet>
            Preferences adjust speech output and assistive features.
          </Bullet>
          <Bullet>
            Safety information is shown inside the app for quick reference.
          </Bullet>
        </Card>

        <SectionTitle>Security</SectionTitle>
        <Card title="Protection" subtitle="Practical steps you can take">
          <Bullet>
            Enable a device screen lock and keep your OS up to date.
          </Bullet>
          <Bullet>
            Don’t share verification codes or passwords with anyone.
          </Bullet>
          <Bullet>
            Review app permissions (camera/microphone) based on features you
            use.
          </Bullet>
        </Card>

        <Card
          title="Permissions"
          subtitle="Used only when you use those features">
          <Bullet>Camera: Explore features (QR/Object detection/OCR).</Bullet>
          <Bullet>Microphone: Voice commands.</Bullet>
        </Card>

        <SectionTitle>Policies</SectionTitle>
        <Card
          title="External policies"
          subtitle="Learn more from our providers">
          <Row
            icon="document-text-outline"
            title="Firebase privacy"
            subtitle="How Firebase processes data"
            onPress={() => void openUrl(FIREBASE_PRIVACY_URL)}
          />
          <View
            className="h-px my-2"
            style={{ backgroundColor: theme.border }}
          />
          <Row
            icon="shield-outline"
            title="Google privacy policy"
            onPress={() => void openUrl(GOOGLE_PRIVACY_URL)}
          />
          <View
            className="h-px my-2"
            style={{ backgroundColor: theme.border }}
          />
          <Row
            icon="receipt-outline"
            title="Google terms"
            onPress={() => void openUrl(GOOGLE_TERMS_URL)}
          />
        </Card>

        <SectionTitle>Controls</SectionTitle>
        <Card
          title="Manage data"
          subtitle="Control permissions and remove saved app data">
          <Row
            icon="settings-outline"
            title="Open device settings"
            subtitle="Manage permissions for camera and microphone"
            onPress={() => void openAppSettings()}
          />
          <View
            className="h-px my-2"
            style={{ backgroundColor: theme.border }}
          />
          <Row
            icon="trash-outline"
            title="Delete my data"
            subtitle="Removes your saved profile & preferences"
            onPress={handleDeleteData}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

export default PrivacyAndSecurityScreen;
