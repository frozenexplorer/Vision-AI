import { Text, View } from 'react-native';
import type { ThemeTokens } from '@/theme';
import { MAX_CITY } from '../constants';
import { ProfileTextField } from './ProfileTextField';

type Props = {
  theme: ThemeTokens;
  cityDraft: string;
  setCityDraft: (s: string) => void;
  onCommitCity: () => void;
  savingExtras: boolean;
  editable: boolean;
};

export const LocationCard = ({
  theme,
  cityDraft,
  setCityDraft,
  onCommitCity,
  savingExtras,
  editable,
}: Props) => (
  <>
    <Text
      className="text-xs font-bold uppercase tracking-wider mb-2"
      style={{ color: theme.grey }}>
      Location
    </Text>
    <View
      className="rounded-2xl border px-4 py-3 mb-4"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.border,
      }}>
      <ProfileTextField
        theme={theme}
        label="City / area"
        value={cityDraft}
        onChangeText={setCityDraft}
        onBlur={onCommitCity}
        maxLength={MAX_CITY}
        placeholder="e.g. Mumbai, Bandra"
        editable={editable && !savingExtras}
      />
      <Text className="text-xs mt-2" style={{ color: theme.muted }}>
        Saves when you leave the field.
      </Text>
    </View>
  </>
);
