import React from 'react';

const PokemonSpeciesInfo = ({ species, pokemon }) => {
  // Fonction pour traduire les groupes d'œufs
  const translateEggGroup = (group) => {
    const translations = {
      'monster': 'Monstre',
      'water1': 'Eau 1',
      'water2': 'Eau 2',
      'water3': 'Eau 3',
      'bug': 'Insecte',
      'flying': 'Vol',
      'ground': 'Sol',
      'fairy': 'Fée',
      'plant': 'Plante',
      'humanshape': 'Humanoïde',
      'mineral': 'Minéral',
      'indeterminate': 'Amorphe',
      'ditto': 'Métamorph',
      'dragon': 'Dragon',
      'no-eggs': 'Inconnu'
    };
    return translations[group] || group;
  };

  // Fonction pour traduire les habitats
  const translateHabitat = (habitat) => {
    if (!habitat) return 'Inconnu';
    
    const translations = {
      'cave': 'Grotte',
      'forest': 'Forêt',
      'grassland': 'Prairie',
      'mountain': 'Montagne',
      'rare': 'Rare',
      'rough-terrain': 'Terrain accidenté',
      'sea': 'Mer',
      'urban': 'Urbain',
      'waters-edge': 'Bord de l\'eau'
    };
    return translations[habitat.name] || habitat.name;
  };

  // Fonction pour traduire le taux de capture
  const getCaptureRateText = (rate) => {
    // Le taux maximum est 255
    const percentage = Math.round((rate / 255) * 100);
    
    if (percentage < 10) return 'Très difficile';
    if (percentage < 30) return 'Difficile';
    if (percentage < 70) return 'Moyen';
    return 'Facile';
  };
  
  // Fonction pour traduire le taux de croissance
  const translateGrowthRate = (rate) => {
    const translations = {
      'slow': 'Lent',
      'medium': 'Moyen',
      'fast': 'Rapide',
      'medium-slow': 'Moyen-Lent',
      'slow-then-very-fast': 'Lent puis Très Rapide',
      'fast-then-very-slow': 'Rapide puis Très Lent'
    };
    return translations[rate] || rate;
  };
  
  // Fonction pour traduire le genre
  const getGenderRatio = (rate) => {
    if (rate === -1) return 'Sans genre';
    const femalePercentage = (rate / 8) * 100;
    const malePercentage = 100 - femalePercentage;
    return `${malePercentage}% ♂ / ${femalePercentage}% ♀`;
  };
  
  // Fonction pour obtenir la classe de couleur Tailwind
  const getColorClass = (colorName) => {
    const colorMap = {
      'black': 'bg-gray-800 text-white',
      'blue': 'bg-blue-500 text-white',
      'brown': 'bg-amber-800 text-white',
      'gray': 'bg-gray-400 text-black',
      'green': 'bg-green-500 text-white',
      'pink': 'bg-pink-400 text-black',
      'purple': 'bg-purple-500 text-white',
      'red': 'bg-red-500 text-white',
      'white': 'bg-white text-gray-800 border border-gray-300',
      'yellow': 'bg-yellow-400 text-black'
    };
    return colorMap[colorName] || 'bg-gray-200 text-gray-800';
  };

  // Fonction pour traduire la couleur en français
  const translateColor = (color) => {
    if (!color) return 'Inconnue';
    const colors = {
      'black': 'Noir',
      'blue': 'Bleu',
      'brown': 'Marron',
      'gray': 'Gris',
      'green': 'Vert',
      'pink': 'Rose',
      'purple': 'Violet',
      'red': 'Rouge',
      'white': 'Blanc',
      'yellow': 'Jaune'
    };
    return colors[color.name] || color.name.charAt(0).toUpperCase() + color.name.slice(1);
  };

  return (
    <div className="bg-white/90 rounded-lg p-4 shadow-md mb-6 hover:shadow-lg transition-shadow">      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
        {/* Taux de capture */}
        <div className="info-item">
          <p className="text-sm font-medium text-gray-600">Taux de capture:</p>
          <p className="text-sm font-semibold">
            <span className={`inline-block px-2 py-1 rounded ${species.capture_rate < 45 ? 'bg-red-100 text-red-800' : species.capture_rate < 120 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {getCaptureRateText(species.capture_rate)} ({Math.round((species.capture_rate / 255) * 100)}%)
            </span>
          </p>
        </div>
        
        {/* Bonheur de base */}
        <div className="info-item">
          <p className="text-sm font-medium text-gray-600">Bonheur de base:</p>
          <p className="text-sm font-semibold text-gray-800">{species.base_happiness}</p>
        </div>
        
        {/* Groupes d'œufs */}
        <div className="info-item">
          <p className="text-sm font-medium text-gray-600">Groupes d'œufs:</p>
          <p className="text-sm">
            {species.egg_groups.map((group, index) => (
              <span key={group.name} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1">
                {translateEggGroup(group.name)}
              </span>
            ))}
          </p>
        </div>
        
        {/* Habitat */}
        <div className="info-item">
          <p className="text-sm font-medium text-gray-600">Habitat:</p>
          <p className="text-sm font-semibold text-gray-800">{translateHabitat(species.habitat)}</p>
        </div>
        
        {/* Génération */}
        <div className="info-item">
          <p className="text-sm font-medium text-gray-600">Génération:</p>
          <p className="text-sm">
            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {species.generation.name.replace('generation-', '').toUpperCase()}
            </span>
          </p>
        </div>
        
        {/* Taux de croissance */}
        <div className="info-item">
          <p className="text-sm font-medium text-gray-600">Croissance:</p>
          <p className="text-sm font-semibold text-gray-800">{translateGrowthRate(species.growth_rate.name)}</p>
        </div>
        
        {/* Ratio de genre */}
        <div className="info-item">
          <p className="text-sm font-medium text-gray-600">Ratio de genre:</p>
          <p className="text-sm font-semibold text-gray-800">{getGenderRatio(species.gender_rate)}</p>
        </div>
        
        {/* Couleur */}
        <div className="info-item">
          <p className="text-sm font-medium text-gray-600">Couleur:</p>
          <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${getColorClass(species.color?.name || '')}`}>
            {translateColor(species.color)}
          </span>
        </div>
        
        {/* Taille et Poids */}
        {pokemon && (
          <div className="info-item">
            <p className="text-sm font-medium text-gray-600">Taille et Poids:</p>
            <p className="text-sm font-semibold text-gray-800">{pokemon.height / 10} m / {pokemon.weight / 10} kg</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonSpeciesInfo;
