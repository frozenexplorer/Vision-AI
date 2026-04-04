export const BAR_COUNT = 8;
export const BAR_MIN = 0.15;
export const BAR_MAX = 1;

export const LOG_NAME = 'VoiceModeAssistant';

export const EVENT_RESULT = 'voice_assistant_result';
export const EVENT_ERROR = 'voice_assistant_error';
export const EVENT_STATE = 'voice_assistant_state';

export const EXPECTED_NATIVE_BUILD_TAG = 'voice-native-v3';

/** Android SpeechRecognizer error codes we may recover from by restarting. */
export const RECOVERABLE_ERROR_CODES = new Set<number>([
  1, // ERROR_NETWORK_TIMEOUT
  2, // ERROR_NETWORK
  6, // ERROR_SPEECH_TIMEOUT
  7, // ERROR_NO_MATCH
  8, // ERROR_RECOGNIZER_BUSY
]);

export const HELP_RESPONSE =
  'Try commands like start object detection, open OCR, open QR scanner, open text to speech, go home, open settings, open alerts, or stop listening.';
