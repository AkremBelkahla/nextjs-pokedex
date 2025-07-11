# Next.js Pokédex

Un Pokédex moderne créé avec Next.js et Tailwind CSS, utilisant l'API publique [PokeAPI](https://pokeapi.co/).

## Fonctionnalités

- Affichage des 100 premiers Pokémon

## Installation

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## Mise en cache avec pokeapi-js-wrapper

Cette application utilise la bibliothèque `pokeapi-js-wrapper` pour optimiser les requêtes API avec une mise en cache automatique côté client. Cela permet :

- De réduire le nombre de requêtes vers l'API PokeAPI
- D'améliorer les performances de l'application
- D'offrir une expérience utilisateur plus fluide
- De fonctionner même en mode hors ligne après le premier chargement des données

La configuration de mise en cache est définie dans le fichier `services/pokeApi.js`.

## Déploiement

Ce projet est prêt à être déployé sur [Vercel](https://vercel.com). Il suffit de connecter votre dépôt GitHub à Vercel pour un déploiement automatique.

## API PokeAPI

Ce projet utilise l'API publique PokeAPI. Voici quelques exemples d'utilisation:

### Liste des Pokémon

```bash
curl https://pokeapi.co/api/v2/pokemon?limit=100
```

### Détails d'un Pokémon spécifique

```bash
curl https://pokeapi.co/api/v2/pokemon/pikachu
```

ou par ID:

```bash
curl https://pokeapi.co/api/v2/pokemon/25
```

Pour plus d'informations, consultez la [documentation officielle de PokeAPI](https://pokeapi.co/docs/v2).

## Technologies utilisées

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PokeAPI](https://pokeapi.co/)

## Licence

MIT
