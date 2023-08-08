export type League = { id: string; name: string; place: number; total: number };

export const makeLeagueFromName = (name: string) => {
  //   return { id: generateShortId(), name: name, place: 1, total: 1 };
  return { id: 'ABCD', name: name, place: 1, total: 1 };
};

// made by our friend chatGPT
// 36 ^ 6 = 2,176,782,336 possible ids. This is good enough for right now.
const generateShortId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 6; // Adjust the length as needed
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};
