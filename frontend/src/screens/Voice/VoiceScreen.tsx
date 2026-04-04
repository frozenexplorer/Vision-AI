import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { SoundWaveBars } from './components';
import { useVoiceMode } from './useVoiceMode';

const VoiceScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const accent = theme.tabVoice;

  const {
    voiceAvailability,
    isAssistantEnabled,
    heardText,
    assistantReply,
    statusText,
    toggleAssistant,
  } = useVoiceMode();

  return (
    <View
      className="flex-1 items-center"
      style={{ paddingTop: insets.top, backgroundColor: theme.screenBg }}>
      <View className="items-center mt-16">
        <Text
          className="text-[28px] font-extrabold tracking-tight mb-2"
          style={{ color: theme.white }}>
          Voice Mode
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <TouchableOpacity
          className="w-40 h-40 rounded-full mb-7 border-2 justify-center items-center"
          style={{
            backgroundColor: isAssistantEnabled ? `${accent}12` : theme.cardBg,
            borderColor: isAssistantEnabled ? accent : `${accent}35`,
          }}
          activeOpacity={0.9}
          onPress={toggleAssistant}>
          <Ionicons name="mic" size={64} color={accent} />
        </TouchableOpacity>

        <SoundWaveBars isActive={isAssistantEnabled} barColor={accent} />

        <Text
          className="text-[13px] font-bold tracking-widest mb-8 text-center"
          style={{ color: isAssistantEnabled ? accent : theme.white }}>
          {statusText}
        </Text>

        <TouchableOpacity
          className="rounded-[14px] py-4 px-7 min-w-[260px] flex-row items-center justify-center gap-2.5 border"
          style={{
            backgroundColor: isAssistantEnabled ? accent : theme.cardBg,
            borderColor: isAssistantEnabled ? 'transparent' : `${accent}40`,
          }}
          activeOpacity={0.8}
          onPress={toggleAssistant}
          disabled={voiceAvailability === 'checking'}>
          <Ionicons
            name={isAssistantEnabled ? 'stop-circle' : 'mic'}
            size={24}
            color={isAssistantEnabled ? theme.white : accent}
          />
          <Text
            className="text-[15px] font-bold"
            style={{ color: isAssistantEnabled ? theme.white : accent }}>
            {isAssistantEnabled ? 'Stop Assistant' : 'Start Assistant'}
          </Text>
        </TouchableOpacity>

        <View className="mt-5 min-h-[68px] max-w-[330px]">
          <Text
            className="text-center text-[12px] leading-5"
            style={{ color: theme.grey }}>
            {heardText ? `Heard: "${heardText}"` : assistantReply}
          </Text>
        </View>

        <View className="mt-1 max-w-[330px]">
          <Text
            className="text-center text-[11px] leading-5"
            style={{ color: theme.muted }}>
            {`Example: "Start object detection"`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default VoiceScreen;
