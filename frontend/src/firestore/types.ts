/**
 * Firestore document types for user profile and settings.
 * Stored at: users/{uid}
 */

export type GenderOption =
  | 'female'
  | 'male'
  | 'non_binary'
  | 'prefer_not_to_say';

export const GENDER_OPTIONS: { value: GenderOption; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export const labelForGender = (
  value: GenderOption | undefined | null,
): string => {
  if (value == null) return 'Not set';
  const row = GENDER_OPTIONS.find(o => o.value === value);
  return row?.label ?? 'Not set';
};

export type BloodGroupOption =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | 'unknown';

export const BLOOD_GROUP_OPTIONS: { value: BloodGroupOption; label: string }[] =
  [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'unknown', label: 'Unknown' },
  ];

export const labelForBloodGroup = (
  value: BloodGroupOption | undefined | null,
): string => {
  if (value == null) return 'Not set';
  const row = BLOOD_GROUP_OPTIONS.find(o => o.value === value);
  return row?.label ?? 'Not set';
};

export interface UserProfile {
  displayName?: string;
  photoURL?: string;
  gender?: GenderOption;
  /** Whole years; optional */
  age?: number;
  cityOrArea?: string;
  emergencyContact?: string;
  bloodGroup?: BloodGroupOption;
  medicalNotes?: string;
  occupation?: string;
  livingSituation?: string;
  updatedAt: FirebaseTimestamp;
}

export interface VoiceSettings {
  speed: number; // 0.5 - 2.0
  pitch: number; // 0.5 - 2.0
}

export interface VisionSettings {
  contrast: number; // 0 - 100
  detectionSensitivity: number; // 0 - 100
}

export interface AccessibilitySettings {
  hapticsEnabled: boolean;
  reduceMotion: boolean;
}

export interface UserSettings {
  voice: VoiceSettings;
  vision: VisionSettings;
  accessibility: AccessibilitySettings;
  updatedAt: FirebaseTimestamp;
}

export interface UserDocument {
  profile: UserProfile;
  settings: UserSettings;
  createdAt: FirebaseTimestamp;
}

export type FirebaseTimestamp = { seconds: number; nanoseconds: number };

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  speed: 1,
  pitch: 1,
};

export const DEFAULT_VISION_SETTINGS: VisionSettings = {
  contrast: 50,
  detectionSensitivity: 50,
};

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  hapticsEnabled: true,
  reduceMotion: false,
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  voice: DEFAULT_VOICE_SETTINGS,
  vision: DEFAULT_VISION_SETTINGS,
  accessibility: DEFAULT_ACCESSIBILITY_SETTINGS,
  updatedAt: { seconds: 0, nanoseconds: 0 },
};
