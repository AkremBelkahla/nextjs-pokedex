import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import Tabs from './Tabs';
import PokemonStats from './PokemonStats';
import PokemonSpeciesInfo from './PokemonSpeciesInfo';
import pokeApi from '../services/pokeApi';

export default function PokemonModal({ isOpen, onClose, pokemonName }) {
  // États pour les données
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [description, setDescription] = useState('');
  const [frenchName, setFrenchName] = useState('');
  const [loading, setLoading] = useState(true);

  // Chargement des données du Pokémon
  useEffect(() => {
    if (!pokemonName || !isOpen) return;

    const loadPokemonData = async () => {
      try {
        setLoading(true);
        
        // Récupération des données du Pokémon
        const pokemonData = await pokeApi.getPokemonByName(pokemonName);
        setPokemon(pokemonData);
        
        // Récupération des données de l'espèce
        const speciesData = await pokeApi.resource(pokemonData.species.url);
        setSpecies(speciesData);
        
        // Récupération du nom français
        const frName = speciesData.names.find(name => name.language.name === 'fr')?.name;
        if (frName) setFrenchName(frName);
        
        // Récupération de la description française
        const frDescription = speciesData.flavor_text_entries
          .find(entry => entry.language.name === 'fr')?.flavor_text
          .replace(/\\f|\\n|\\r/g, ' ');
        setDescription(frDescription || '');
        
        // Récupération de la chaîne d'évolution
        if (speciesData.evolution_chain) {
          const evolutionData = await pokeApi.resource(speciesData.evolution_chain.url);
          setEvolutionChain(evolutionData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setLoading(false);
      }
    };
    
    loadPokemonData();
  }, [pokemonName, isOpen]);

  // Fonction pour obtenir le type principal du Pokémon
  const getMainType = () => {
    if (!pokemon || !pokemon.types || pokemon.types.length === 0) return 'normal';
    return pokemon.types[0].type.name;
  };

  // Fonction pour traduire les types en français
  const translateType = (type) => {
    const types = {
      'NORMAL': 'NORMAL',
      'FIRE': 'FEU',
      'WATER': 'EAU',
      'ELECTRIC': 'ÉLECTRIK',
      'GRASS': 'PLANTE',
      'ICE': 'GLACE',
      'FIGHTING': 'COMBAT',
      'POISON': 'POISON',
      'GROUND': 'SOL',
      'FLYING': 'VOL',
      'PSYCHIC': 'PSY',
      'BUG': 'INSECTE',
      'ROCK': 'ROCHE',
      'GHOST': 'SPECTRE',
      'DRAGON': 'DRAGON',
      'DARK': 'TÉNÈBRES',
      'STEEL': 'ACIER',
      'FAIRY': 'FÉE',
      'UNKNOWN': 'INCONNU',
      'SHADOW': 'OMBRE'
    };
    return types[type] || type;
  };

  // Fonction pour obtenir les types du Pokémon
  const getTypes = () => {
    if (!pokemon || !pokemon.types) return [];
    return pokemon.types.map(typeInfo => typeInfo.type.name);
  };
  
  // Fonction pour obtenir les types traduits en français
  const getTranslatedTypes = () => {
    return getTypes().map(type => translateType(type.toUpperCase()));
  };

  // Fonction pour obtenir la couleur de fond selon le type
  const getTypeColor = (type) => {
    const typeColors = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    
    return typeColors[type] || 'bg-gray-400';
  };

  // Fonction pour obtenir le dégradé de couleur selon le type
  const getTypeGradient = (type) => {
    const typeGradients = {
      normal: 'from-gray-300 to-gray-400',
      fire: 'from-red-400 to-red-600',
      water: 'from-blue-400 to-blue-600',
      electric: 'from-yellow-300 to-yellow-500',
      grass: 'from-green-400 to-green-600',
      ice: 'from-blue-200 to-blue-400',
      fighting: 'from-red-600 to-red-800',
      poison: 'from-purple-400 to-purple-600',
      ground: 'from-yellow-500 to-yellow-700',
      flying: 'from-indigo-200 to-indigo-400',
      psychic: 'from-pink-400 to-pink-600',
      bug: 'from-lime-400 to-lime-600',
      rock: 'from-yellow-600 to-yellow-800',
      ghost: 'from-purple-600 to-purple-800',
      dragon: 'from-indigo-600 to-indigo-800',
      dark: 'from-gray-700 to-gray-900',
      steel: 'from-gray-400 to-slate-500',
      fairy: 'from-pink-300 to-rose-400',
    };

    return typeGradients[type] || 'from-gray-300 to-gray-400';
  };
  
  // Composant pour rendre un élément de la chaîne d'évolution
  const EvolutionItem = ({ chain }) => {
    if (!chain) return null;
    
    const pokemonId = chain.species.url.split('/').filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    const pokemonName = chain.species.name;
    
    // Récupération du nom français si disponible (via cache)
    const [frenchEvolutionName, setFrenchEvolutionName] = useState(pokemonName);
    
    useEffect(() => {
      const fetchFrenchName = async () => {
        try {
          // Utilisation du cache via pokeapi-js-wrapper
          const speciesData = await pokeApi.resource(chain.species.url);
          const frName = speciesData.names.find(name => name.language.name === 'fr')?.name;
          if (frName) setFrenchEvolutionName(frName);
        } catch (error) {
          console.error(`Erreur lors de la récupération du nom français pour ${pokemonName}:`, error);
        }
      };
      
      fetchFrenchName();
    }, [chain.species.url, pokemonName]);
    
    return (
      <div className="evolution-chain" key={pokemonName}>
        <div className="evolution-item">
          <div className="evolution-link cursor-pointer" onClick={() => onClose()}>
            <div className="evolution-image-container">
              <Image 
                src={imageUrl} 
                alt={frenchEvolutionName} 
                width={80} 
                height={80} 
                className="evolution-image" 
              />
            </div>
            <div className="evolution-name">{frenchEvolutionName}</div>
          </div>
        </div>
        
        {chain.evolves_to && chain.evolves_to.length > 0 && (
          <div className="evolution-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        )}
        
        <div className="evolution-next">
          {chain.evolves_to && chain.evolves_to.map((nextChain, index) => (
            <React.Fragment key={`evolution-${index}`}>
              <EvolutionItem chain={nextChain} />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  // Fonction wrapper pour la chaîne d'évolution complète
  const renderEvolutionChain = (chain) => {
    if (!chain) return null;
    return <EvolutionItem chain={chain} />;
  };

  // Si les données ne sont pas encore chargées, afficher un loader
  if (!pokemon || loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Chargement..." size="lg">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </Modal>
    );
  }

  // Définition des onglets
  const tabs = [
    {
      label: "Informations",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          {/* Informations sur l'espèce */}
          {species && <PokemonSpeciesInfo species={species} pokemon={pokemon} />}
        </div>
      ),
    },
    {
      label: "Statistiques",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      content: (
        <div>
          <PokemonStats stats={pokemon.stats} />
        </div>
      ),
    },
    {
      label: "Évolution",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      ),
      content: (
        <div className="p-4">
          <div className="flex flex-nowrap items-center justify-start gap-4 overflow-x-auto">
            {evolutionChain ? (
              renderEvolutionChain(evolutionChain.chain)
            ) : (
              <div className="flex items-center justify-center w-full py-8">
                <p className="text-gray-600">Aucune donnée d'évolution disponible</p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      label: "Capacités",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      content: (
        <div className="p-4">
          <div className="flex flex-wrap gap-3 justify-start">
            {pokemon.abilities.map((ability, index) => {
              // Traduction française des capacités communes
              const abilityTranslations = {
                'overgrow': 'Engrais',
                'blaze': 'Brasier',
                'torrent': 'Torrent',
                'shield-dust': 'Écran Poudre',
                'shed-skin': 'Mue',
                'compound-eyes': 'Œil Composé',
                'swarm': 'Essaim',
                'keen-eye': 'Regard Vif',
                'run-away': 'Fuite',
                'intimidate': 'Intimidation',
                'static': 'Statik',
                'sand-veil': 'Voile Sable',
                'poison-point': 'Point Poison',
                'cute-charm': 'Joli Sourire',
                'flash-fire': 'Torche',
                'limber': 'Échauffement',
                'damp': 'Moiteur',
                'cloud-nine': 'Ciel Gris',
                'vital-spirit': 'Esprit Vital',
                'chlorophyll': 'Chlorophylle',
                'effect-spore': 'Spore',
                'synchronize': 'Synchro',
                'clear-body': 'Corps Sain',
                'natural-cure': 'Médic Nature',
                'lightning-rod': 'Paratonnerre',
                'rock-head': 'Tête de Roc',
                'sturdy': 'Fermeté',
                'oblivious': 'Benêt',
                'inner-focus': 'Attention',
                'magnet-pull': 'Magnépiège',
                'soundproof': 'Anti-Bruit',
                'rain-dish': 'Cuvette',
                'arena-trap': 'Piège',
                'pickup': 'Ramassage',
                'truant': 'Absentéisme',
                'hustle': 'Agitation',
                'guts': 'Cran',
                'marvel-scale': 'Écaille Spéciale',
                'liquid-ooze': 'Suintement',
                'thick-fat': 'Isograisse',
                'early-bird': 'Matinal',
                'flame-body': 'Corps Ardent',
                'insomnia': 'Insomnia',
                'color-change': 'Déguisement',
                'immunity': 'Vaccin',
                'levitate': 'Lévitation',
              };
              
              const frenchName = abilityTranslations[ability.ability.name] || ability.ability.name;
              
              return (
                <div 
                  key={ability.ability.name}
                  className={`px-3 py-1 rounded-full ${ability.is_hidden ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'} text-sm font-medium`}
                >
                  {frenchName}
                  {ability.is_hidden && <span className="ml-1 text-xs">(Cachée)</span>}
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      label: "Sprites",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pokemon.sprites.front_default && (
            <div className="sprite-card bg-gray-50 rounded-lg p-3 text-center shadow-sm">
              <div className="relative h-24 w-24 mx-auto">
                <Image 
                  src={pokemon.sprites.front_default} 
                  alt={`${frenchName} face`} 
                  layout="fill" 
                  objectFit="contain"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">Face</p>
            </div>
          )}
          
          {pokemon.sprites.back_default && (
            <div className="sprite-card bg-gray-50 rounded-lg p-3 text-center shadow-sm">
              <div className="relative h-24 w-24 mx-auto">
                <Image 
                  src={pokemon.sprites.back_default} 
                  alt={`${frenchName} dos`} 
                  layout="fill" 
                  objectFit="contain"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">Dos</p>
            </div>
          )}
          
          {pokemon.sprites.front_shiny && (
            <div className="sprite-card bg-gray-50 rounded-lg p-3 text-center shadow-sm">
              <div className="relative h-24 w-24 mx-auto">
                <Image 
                  src={pokemon.sprites.front_shiny} 
                  alt={`${frenchName} shiny face`} 
                  layout="fill" 
                  objectFit="contain"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">Shiny face</p>
            </div>
          )}
          
          {pokemon.sprites.back_shiny && (
            <div className="sprite-card bg-gray-50 rounded-lg p-3 text-center shadow-sm">
              <div className="relative h-24 w-24 mx-auto">
                <Image 
                  src={pokemon.sprites.back_shiny} 
                  alt={`${frenchName} shiny dos`} 
                  layout="fill" 
                  objectFit="contain"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">Shiny dos</p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={frenchName || pokemon.name} 
      description={description || "Aucune description disponible."}
      size="lg"
      headerClassName={`bg-gradient-to-r ${getTypeGradient(getMainType())} text-white rounded-t-xl`}
    >
      <div>
        
        {/* Image et informations de base */}
        <div className="flex flex-row items-center mt-6 mb-6 relative z-10 px-6">
          {/* Photo à gauche */}
          <div className="flex-shrink-0">
            <div className="bg-white/80 rounded-full p-4 shadow-lg border-4 border-white">
              <div className="relative w-32 h-32">
                <Image
                  src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                  alt={frenchName || pokemon.name}
                  layout="fill"
                  objectFit="contain"
                  priority
                  className="drop-shadow-xl"
                />
              </div>
            </div>
          </div>
          
          {/* Informations à droite */}
          <div className="flex-grow ml-6">
            <p className="text-gray-500 font-mono mb-1">#{pokemon.id.toString().padStart(3, '0')}</p>
            <div className="mb-3">
              <h2 className="text-xl font-bold text-gray-800">{frenchName || pokemon.name}</h2>
            </div>
            
            {/* Types */}
            <div className="flex space-x-2 mb-4">
              {getTranslatedTypes().map((type, index) => (
                <span 
                  key={index} 
                  className={`${getTypeColor(getTypes()[index])} type-badge`}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Onglets */}
        <Tabs tabs={tabs} />
      </div>
    </Modal>
  );
}
