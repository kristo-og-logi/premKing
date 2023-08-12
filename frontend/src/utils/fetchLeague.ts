import { SelectedLeague } from '../types/League';

const leagues: SelectedLeague[] = [
  {
    id: 'asdf',
    name: 'The big league',
    players: [
      {
        id: 'EXAMPLE',
        name: 'winner',
        points: [
          { gw: 1, points: 12 },
          { gw: 2, points: 12 },
          { gw: 3, points: 12 },
        ],
      },
      {
        id: 'abcdabcd',
        name: 'kristofer',
        points: [
          { gw: 1, points: 15 },
          { gw: 2, points: 4 },
          { gw: 3, points: 20 },
        ],
      },
      {
        id: '12341234',
        name: 'logi',
        points: [
          { gw: 1, points: 10 },
          { gw: 2, points: 10 },
          { gw: 3, points: 30 },
        ],
      },
    ],
  },
  {
    id: 'ABCD',
    name: 'LEEEAAGUEEE',
    players: [
      {
        id: 'gggg',
        name: 'guðrun',
        points: [
          { gw: 1, points: 63 },
          { gw: 2, points: 64 },
          { gw: 3, points: 73 },
        ],
      },
      {
        id: 'EXAMPLE',
        name: 'winner',
        points: [
          { gw: 1, points: 47 },
          { gw: 2, points: 52 },
          { gw: 3, points: 51 },
        ],
      },
      {
        id: 'fbfbfbfb',
        name: 'hanna',
        points: [
          { gw: 1, points: 15 },
          { gw: 2, points: 12 },
          { gw: 3, points: 13 },
        ],
      },
      {
        id: 'fbfbfbfba',
        name: 'hansy',
        points: [
          { gw: 1, points: 140 },
          { gw: 2, points: 165 },
          { gw: 3, points: 115 },
        ],
      },
      {
        id: 'fbfsdfabfbfb',
        name: 'ronaldo',
        points: [
          { gw: 1, points: 34 },
          { gw: 2, points: 50 },
          { gw: 3, points: 56 },
        ],
      },
      {
        id: 'fbfbfbfbasd',
        name: 'test',
        points: [
          { gw: 1, points: 3 },
          { gw: 2, points: 5 },
          { gw: 3, points: 2 },
        ],
      },
      {
        id: 'fbfbfbasdffb',
        name: 'john doe',
        points: [
          { gw: 1, points: 47 },
          { gw: 2, points: 33 },
          { gw: 3, points: 20 },
        ],
      },
      {
        id: 'fAAAbfbfbfb',
        name: 'anonymous',
        points: [
          { gw: 1, points: 22 },
          { gw: 2, points: 25 },
          { gw: 3, points: 13 },
        ],
      },
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

  if (!response) throw new Error(`league with id ${id} not found`);
  return response;
};
