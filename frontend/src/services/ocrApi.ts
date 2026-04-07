import { NativeModules } from 'react-native';
import { error, logApi } from '@/utils/logger';

export interface OcrBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface OcrLine {
  text: string;
  bounds: OcrBounds;
}

export interface OcrBlock {
  text: string;
  bounds: OcrBounds;
  lines: OcrLine[];
}

export interface OcrResult {
  text: string;
  blocks: OcrBlock[];
}

type OcrNativeModule = {
  recognizeTextFromFile?: (path: string) => Promise<OcrResult>;
};

const toSafeText = (value: unknown): string =>
  typeof value === 'string' ? value : '';

const normalizeBounds = (value: unknown): OcrBounds => {
  const record =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : {};
  const toNum = (key: string): number => {
    const raw = record[key];
    const parsed = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  return {
    left: toNum('left'),
    top: toNum('top'),
    right: toNum('right'),
    bottom: toNum('bottom'),
    width: toNum('width'),
    height: toNum('height'),
  };
};

const normalizeResult = (value: unknown): OcrResult => {
  const record =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : {};
  const blocksRaw = Array.isArray(record.blocks) ? record.blocks : [];

  const blocks: OcrBlock[] = blocksRaw.map(item => {
    const block =
      item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const linesRaw = Array.isArray(block.lines) ? block.lines : [];
    const lines: OcrLine[] = linesRaw.map(lineItem => {
      const line =
        lineItem && typeof lineItem === 'object'
          ? (lineItem as Record<string, unknown>)
          : {};
      return {
        text: toSafeText(line.text),
        bounds: normalizeBounds(line.bounds),
      };
    });
    return {
      text: toSafeText(block.text),
      bounds: normalizeBounds(block.bounds),
      lines,
    };
  });

  return {
    text: toSafeText(record.text),
    blocks,
  };
};

export const recognizeTextFromImage = async (
  imagePath: string,
): Promise<OcrResult> => {
  const endpoint = 'native:OcrModule.recognizeTextFromFile';
  logApi('request', endpoint, { imagePath: imagePath.slice(0, 80) });
  const native = NativeModules?.OcrModule as OcrNativeModule | undefined;
  if (typeof native?.recognizeTextFromFile !== 'function') {
    logApi('error', endpoint, { message: 'OCR native module missing' });
    throw new Error('OCR module is not available on this build.');
  }
  const start = Date.now();
  try {
    const raw = await native.recognizeTextFromFile(imagePath);
    const normalized = normalizeResult(raw);
    logApi('response', endpoint, {
      durationMs: Date.now() - start,
      chars: normalized.text.length,
      blocks: normalized.blocks.length,
      lines: normalized.blocks.reduce((sum, b) => sum + b.lines.length, 0),
    });
    return normalized;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    logApi('error', endpoint, {
      durationMs: Date.now() - start,
      message,
    });
    error('OCR:NativeRecognizeError', { message });
    throw e;
  }
};
