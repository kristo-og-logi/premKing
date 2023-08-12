import { SelectedLeague } from '../types/League';

const leagues: SelectedLeague[] = [
  {
    id: 'asdf',
    name: 'The big league',
    players: [
      { id: 'abcdabcd', name: 'kristofer', points: 123 },
      { id: '12341234', name: 'logi', points: 83 },
    ],
  },
  {
    id: 'ABCD',
    name: 'LEEEAAGUEEE',
    players: [
      { id: 'fbfbfbfb', name: 'hanna', points: 40 },
      { id: 'gggg', name: 'guðrun', points: 100 },
    ],
  },
];

export const fetchLeagues = async () => {
  //fetch all leagues
  return leagues;
};

export const fetchLeagueById = async (id: string = '') => {
  // const response = await fetch(`${BACKEND}/api/v1/leagues/${id}`)
  const response = leagues.find((league) => league.id === id);
  console.log('response', response);

  if (!response) throw new Error(`league with id ${id} not found`);
  return response;
};
