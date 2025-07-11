import { useCallback } from 'react';

// Clés en anglais pour la logique de filtrage
const typeKeys = [
  'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

// Libellés en français pour l'affichage
const typeLabels = {
  all: 'Tous',
  normal: 'Normal',
  fire: 'Feu',
  water: 'Eau',
  electric: 'Électrik',
  grass: 'Plante',
  ice: 'Glace',
  fighting: 'Combat',
  poison: 'Poison',
  ground: 'Sol',
  flying: 'Vol',
  psychic: 'Psy',
  bug: 'Insecte',
  rock: 'Roche',
  ghost: 'Spectre',
  dragon: 'Dragon',
  dark: 'Ténèbres',
  steel: 'Acier',
  fairy: 'Fée'
};

const typeColors = {
  normal: 'bg-gray-400 hover:bg-gray-500',
  fire: 'bg-red-500 hover:bg-red-600',
  water: 'bg-blue-500 hover:bg-blue-600',
  electric: 'bg-yellow-400 hover:bg-yellow-500',
  grass: 'bg-green-500 hover:bg-green-600',
  ice: 'bg-cyan-300 hover:bg-cyan-400',
  fighting: 'bg-red-700 hover:bg-red-800',
  poison: 'bg-purple-600 hover:bg-purple-700',
  ground: 'bg-amber-500 hover:bg-amber-600',
  flying: 'bg-indigo-400 hover:bg-indigo-500',
  psychic: 'bg-pink-500 hover:bg-pink-600',
  bug: 'bg-lime-500 hover:bg-lime-600',
  rock: 'bg-amber-700 hover:bg-amber-800',
  ghost: 'bg-indigo-700 hover:bg-indigo-800',
  dragon: 'bg-purple-800 hover:bg-purple-900',
  dark: 'bg-gray-800 hover:bg-gray-900',
  steel: 'bg-gray-500 hover:bg-gray-600',
  fairy: 'bg-pink-300 hover:bg-pink-400',
  all: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
};

export default function TypeFilter({ selectedType, onTypeSelect }) {
  const getTypeLabel = useCallback((type) => {
    return typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
      {typeKeys.map((type) => (
        <button
          key={type}
          onClick={() => onTypeSelect(type)}
          className={`px-4 py-2 rounded-full text-white font-medium text-sm sm:text-base transition-all duration-200 shadow-md ${
            typeColors[type] || 'bg-gray-500 hover:bg-gray-600'
          } ${selectedType === type ? 'ring-2 ring-offset-2 ring-yellow-400 scale-105' : 'hover:scale-105'}`}
          title={type !== 'all' ? `Afficher les Pokémon de type ${getTypeLabel(type)}` : 'Afficher tous les Pokémon'}
        >
          {getTypeLabel(type)}
        </button>
      ))}
    </div>
  );
}
