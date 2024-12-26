import { Buffer } from 'buffer';

export const jwtDecode = (token: string): { exp: number; id: string; name: string } => {
  const part = token.split('.')[1];
  const decoded = Buffer.from(part, 'base64').toString();
  return JSON.parse(decoded);
};
