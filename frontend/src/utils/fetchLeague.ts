import { SelectedLeague } from '../types/League';

const leagues: SelectedLeague[] = [
  {
    id: 'asdf',
    name: 'The big league',
    players: [
      { id: 'abcdabcd', name: 'kristofer' },
      { id: '12341234', name: 'logi' },
    ],
  },
  {
    id: 'ABCD',
    name: 'LEEEAAGUEEE',
    players: [
      { id: 'abcdabcd', name: 'kristofer' },
      { id: '12341234', name: 'logi' },
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
