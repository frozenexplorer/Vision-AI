import { logApi } from '@/utils/logger';

export type OcrLine = { text: string };
export type OcrBlock = { lines: OcrLine[] };

export type OcrResult = {
  /** Full text, if available from the OCR engine. */
  text: string;
  /** Structured blocks/lines for fallback rendering. */
  blocks: OcrBlock[];
};
