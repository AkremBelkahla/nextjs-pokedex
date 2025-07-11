import { Pokedex } from 'pokeapi-js-wrapper';

// Configuration de l'API avec mise en cache
const pokeApi = new Pokedex({
  protocol: 'https',
  hostName: 'pokeapi.co',
  versionPath: '/api/v2/',
  cache: true,
  timeout: 20 * 1000 // 20 secondes de timeout
});

export default pokeApi;
