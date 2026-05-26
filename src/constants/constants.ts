export const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
export const API_CONCURRENCY = 5;

export const SEARCH_LIMIT = 500;
export const MAX_ITEMS = 1200;

export const CARD_LIMIT = 18;

export const LOADING_DELAY_MS = 300;

export const DEFAULT_CACHE_TTL = 300;

export const HTTP_STATUS = {
  NETWORK_ERROR: 0,
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_STATUS = {
  SUCCESS: 'success',
  NOT_FOUND: 'not-found',
  ERROR: 'error',
  LOADING: 'loading',
} as const;

export type ApiStatus = (typeof API_STATUS)[keyof typeof API_STATUS];

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LAYOUT: '/_layout',
  DETAILS: '/details',
  DETAIL: '/details/$detailId',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const ERROR_MESSAGES = {
  DEFAULT: 'Something went wrong. Try again later.',
  SERVER: 'Server error. Try again later.',
  NETWORK: 'Network error. Check your internet connection.',
  NOTFOUND: 'Pokemon not found.',
} as const;

export type ErrorMessageType =
  (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
