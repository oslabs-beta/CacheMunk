import { SELECT_CITIES, SELECT_CITIES_COSTLY } from './queries.js';

export const queriesMap: Record<string, string> = {
  'SELECT_CITIES_COSTLY': SELECT_CITIES_COSTLY,
  'SELECT_CITIES': SELECT_CITIES
}

export const dependenciesMap: Record<string, string[]> = {
  'SELECT_CITIES_COSTLY': ['cities'],
  'SELECT_CITIES': ['cities'],
}