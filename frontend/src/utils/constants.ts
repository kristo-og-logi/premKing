import { BACKEND_URL } from '@env';

export const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const ID_LEN = 6;
export const ERROR_TIMEOUT = 3000;
export const backend = `${BACKEND_URL}/api/v1`;

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
