import Image from 'next/image';

const PokemonCard = ({ pokemon }) => {
  const id = pokemon.id;
  // Même logique de sélection d'image que dans PokemonModal
  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                 pokemon.sprites?.front_default || 
                 `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` ||
                 `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  // Fonction pour obtenir une couleur de fond aléatoire mais cohérente pour chaque Pokémon
  const getBackgroundGradient = (id) => {
    const colors = [
      'from-red-400 to-pink-300',
      'from-blue-400 to-indigo-300',
      'from-green-400 to-emerald-300',
      'from-yellow-300 to-amber-200',
      'from-purple-400 to-fuchsia-300',
      'from-cyan-400 to-sky-300',
      'from-orange-400 to-amber-300',
    ];
    return colors[id % colors.length];
  };

  return (
    <div 
      className="pokemon-card cursor-pointer relative overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300" 
      style={{ '--animation-order': id % 20 }}
    >
      {/* Fond de la Poké Ball */}
      <div className="absolute inset-0 z-0">
        {/* Partie supérieure (rouge) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-500 to-red-600"></div>
        {/* Partie inférieure (blanche) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
        {/* Ligne horizontale au milieu */}
        <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-800 transform -translate-y-1/2"></div>
        {/* Cercle central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-4 border-gray-800"></div>
      </div>
      
      {/* Contenu du Pokémon */}
      <div className="relative z-30 flex flex-col items-center justify-center w-full h-full p-2">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              layout="fill"
              objectFit="contain"
              className="drop-shadow-xl"
              unoptimized={imageUrl?.includes?.('raw.githubusercontent.com') || false}
            />
          </div>
        </div>
        {/* Nom du Pokémon */}
        <div className="text-center mt-2 z-30 w-full px-2">
          <div className="inline-block bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
            <h3 className="text-sm font-bold capitalize text-white drop-shadow-lg">
              {pokemon.name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
