// Mock QRCode implementation for TypeScript compilation

export interface QRCodeOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  type?: 'image/png' | 'image/jpeg';
  quality?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  width?: number;
}

export const toDataURL = (text: string, options?: QRCodeOptions): Promise<string> => {
  return Promise.resolve('data:image/png;base64,mock-qr-code');
};

export const toString = (text: string, options?: any): Promise<string> => {
  return Promise.resolve('mock-qr-string');
};

export default { toDataURL, toString };