import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import PokemonStats from '../../components/PokemonStats';
import PokemonSpeciesInfo from '../../components/PokemonSpeciesInfo';
import pokeApi from '../../services/pokeApi';

export default function PokemonDetail({ pokemon: initialPokemon, species: initialSpecies, evolutionChain: initialEvolutionChain, description: initialDescription, frenchName: initialFrenchName }) {
  // États pour les données
  const [pokemon, setPokemon] = useState(initialPokemon);
  const [species, setSpecies] = useState(initialSpecies);
  const [evolutionChain, setEvolutionChain] = useState(initialEvolutionChain);
  const [description, setDescription] = useState(initialDescription);
  const [frenchName, setFrenchName] = useState(initialFrenchName);
  const [loading, setLoading] = useState(false);
  
  // Utilisation de pokeapi-js-wrapper pour charger les données avec mise en cache
  useEffect(() => {
    const loadPokemonDataWithCache = async () => {
      if (!initialPokemon || !initialPokemon.name) return;
      
      try {
        setLoading(true);
        
        // Récupération des données du Pokémon
        const pokemonData = await pokeApi.getPokemonByName(initialPokemon.name);
        setPokemon(pokemonData);
        
        // Récupération des données d'espèce
        const speciesData = await pokeApi.resource(pokemonData.species.url);
        setSpecies(speciesData);
        
        // Récupération de la chaîne d'évolution
        const evolutionData = await pokeApi.resource(speciesData.evolution_chain.url);
        setEvolutionChain(evolutionData);
        
        // Extraction de la description en français ou anglais
        const frDesc = speciesData.flavor_text_entries.find(entry => entry.language.name === 'fr')?.flavor_text;
        const enDesc = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text;
        setDescription(frDesc || enDesc || initialDescription || '');
        
        // Extraction du nom français
        const frName = speciesData.names.find(name => name.language.name === 'fr')?.name;
        setFrenchName(frName || pokemonData.name);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Si nous avons déjà des données initiales complètes, pas besoin de les recharger immédiatement
    if (!initialSpecies || !initialEvolutionChain) {
      loadPokemonDataWithCache();
    }
  }, [initialPokemon, initialSpecies, initialEvolutionChain, initialDescription, initialFrenchName]);
  
  if (!pokemon) {
    return (
      <div className="container-main pokeball-bg text-center">
        <div className="bg-white/80 backdrop-blur-sm p-10 rounded-xl shadow-lg">
          <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  // Obtenir les types du Pokémon
  const types = pokemon.types.map(type => type.type.name);
  const mainType = types[0];

  // Fonction pour obtenir la couleur de fond en fonction du type principal
  const getTypeColor = (type) => {
    const typeColors = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-600',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };

    return typeColors[type] || 'bg-gray-400';
  };

  // Fonction pour obtenir le dégradé de couleur en fonction du type principal
  const getTypeGradient = (type) => {
    const typeGradients = {
      normal: 'from-gray-300 to-gray-400',
      fire: 'from-red-400 to-orange-500',
      water: 'from-blue-400 to-cyan-500',
      electric: 'from-yellow-300 to-amber-400',
      grass: 'from-green-400 to-emerald-500',
      ice: 'from-blue-200 to-cyan-300',
      fighting: 'from-red-600 to-red-700',
      poison: 'from-purple-400 to-fuchsia-500',
      ground: 'from-yellow-600 to-amber-700',
      flying: 'from-indigo-200 to-blue-300',
      psychic: 'from-pink-400 to-fuchsia-400',
      bug: 'from-lime-400 to-green-500',
      rock: 'from-yellow-500 to-amber-600',
      ghost: 'from-purple-600 to-indigo-700',
      dragon: 'from-indigo-600 to-blue-700',
      dark: 'from-gray-700 to-gray-800',
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
          <Link href={`/pokemon/${pokemonName}`} className="evolution-link">
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
          </Link>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white pb-12">
      <Head>
        <title>{frenchName || pokemon.name} | Pokédex</title>
        <meta name="description" content={`Détails sur le Pokémon ${frenchName || pokemon.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg font-medium">Chargement des données...</p>
          </div>
        </div>
      )}

      <Link href="/" className="fixed top-4 left-4 z-10 inline-flex items-center px-3 sm:px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn" style={{animationDelay: '0.1s'}}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm sm:text-base">Retour à la liste</span>
      </Link>
      
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border-2 border-white/50 transform transition-all hover:shadow-2xl">
        {/* Bannière de type */}
        <div className={`bg-gradient-to-r ${getTypeGradient(mainType)} h-24 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-white/30 animate-pulse" 
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 4 + 3}s`,
                }}
              ></div>
            ))}
          </div>
          <div className="absolute bottom-0 right-0 p-4 text-white font-bold text-xl uppercase tracking-wider drop-shadow-lg animate-slideIn">
            {mainType}
          </div>
        </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row">
          {/* Image et informations de base */}
          <div className="md:w-1/3 flex flex-col items-center relative">
            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white/80 rounded-full p-4 shadow-lg border-4 border-white animate-pulse-slow">
              <div className="relative w-40 h-40 animate-bounce-slow">
                <Image
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  layout="fill"
                  objectFit="contain"
                  priority
                  className="drop-shadow-xl"
                />
                </div>
              </div>
              <div className="mt-24 text-center">
                <h1 className="text-3xl font-extrabold capitalize bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-fadeIn" style={{animationDelay: '0.2s'}}>{frenchName}</h1>
                <p className="text-gray-500 mb-4 font-mono animate-fadeIn" style={{animationDelay: '0.3s'}}>#{pokemon.id.toString().padStart(3, '0')}</p>
                
                {/* Types */}
                <div className="flex justify-center space-x-2 mb-6">
                  {types.map(type => (
                    <span 
                      key={type} 
                      className={`${getTypeColor(type)} type-badge`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                
                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center mt-4 bg-white/80 rounded-lg p-3 sm:p-4 animate-fadeIn shadow-sm" style={{animationDelay: '0.35s'}}>
                  <div className="transform transition-all duration-300 hover:scale-105 bg-gray-50/80 rounded-lg p-2 sm:p-3 shadow-sm">
                    <div className="flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                      <p className="text-gray-500 text-sm">Taille</p>
                    </div>
                    <p className="font-bold text-lg sm:text-xl">{pokemon.height / 10} m</p>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105 bg-gray-50/80 rounded-lg p-2 sm:p-3 shadow-sm">
                    <div className="flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2M6 7H3m15 0h3M6 7l3-2m12 0l-3-2" />
                      </svg>
                      <p className="text-gray-500 text-sm">Poids</p>
                    </div>
                    <p className="font-bold text-lg sm:text-xl">{pokemon.weight / 10} kg</p>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mt-6 bg-white/80 rounded-lg p-3 sm:p-4 text-left animate-fadeIn shadow-sm" style={{animationDelay: '0.4s'}}>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700 border-b border-gray-200 pb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Description
                  </h3>
                  <div className="bg-gray-50/80 rounded-lg p-3 shadow-sm">
                    <p className="text-gray-600 italic leading-relaxed text-sm sm:text-base">{description.replace(/\f|\n|\r/g, ' ')}</p>
                  </div>
                </div>
                
                {/* Informations sur l'espèce */}
                <div className="mt-8 animate-fadeIn" style={{animationDelay: '0.3s'}}>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 border-b-2 border-gray-200 pb-2 text-gray-800">Informations sur l'espèce</h3>
                  <div className="bg-white/80 rounded-lg shadow-sm p-3 sm:p-4">
                    <PokemonSpeciesInfo species={species} />
                  </div>
                </div>
              </div>
            </div>
          
            {/* Statistiques */}
            <div className="md:w-2/3 mt-8 md:mt-0 md:pl-4 sm:pl-6 lg:pl-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 sm:p-5 shadow-lg animate-fadeIn border border-gray-100">
                <div className="transform transition-all duration-500 hover:scale-[1.02]">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 border-b-2 border-gray-200 pb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Statistiques
                  </h3>
                  <PokemonStats stats={pokemon.stats} />
                </div>
              
                {/* Évolution */}
                <div className="mt-8 animate-fadeIn" style={{animationDelay: '0.4s'}}>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 border-b-2 border-gray-200 pb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                    Évolution
                  </h3>
                  <div className="flex flex-nowrap items-center justify-start gap-2 sm:gap-4 p-3 sm:p-4 bg-white/80 rounded-lg shadow-sm overflow-x-auto evolution-chain">
                    {evolutionChain ? (
                      renderEvolutionChain(evolutionChain.chain)
                    ) : (
                      <div className="flex items-center justify-center w-full py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                        <p className="text-gray-600">Chargement des données d'évolution...</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Capacités */}
                <div className="mt-8 animate-fadeIn" style={{animationDelay: '0.5s'}}>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 border-b-2 border-gray-200 pb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Capacités
                  </h3>
                  <div className="bg-white/80 rounded-lg shadow-sm p-3 sm:p-4">
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
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
                        'chlorophyll': 'Chlorophylle',
                        'effect-spore': 'Spore',
                        'inner-focus': 'Attention',
                        'synchronize': 'Synchro',
                        'clear-body': 'Corps Sain',
                        'natural-cure': 'Médic Nature',
                        'lightning-rod': 'Paratonnerre',
                        'rock-head': 'Tête de Roc',
                        'sturdy': 'Fermeté',
                        'damp': 'Moiteur',
                        'arena-trap': 'Piège',
                        'vital-spirit': 'Esprit Vital',
                        'water-absorb': 'Absorb Eau',
                        'flame-body': 'Corps Ardent',
                        'huge-power': 'Coloforce',
                        'levitate': 'Lévitation',
                        'insomnia': 'Insomnia',
                        'color-change': 'Déguisement',
                        'immunity': 'Vaccin',
                        'thick-fat': 'Isograisse',
                        'early-bird': 'Matinal',
                        'hyper-cutter': 'Hyper Cutter',
                        'pressure': 'Pression',
                        'guts': 'Cran',
                        'marvel-scale': 'Écaille Spéciale',
                        'liquid-ooze': 'Suintement',
                      };
                      
                      const abilityName = ability.ability.name;
                      const translatedName = abilityTranslations[abilityName] || abilityName.replace('-', ' ');
                      const isHidden = ability.is_hidden;
                      
                      return (
                        <div 
                          key={abilityName} 
                          className={`bg-white px-3 sm:px-4 py-2 rounded-lg shadow text-sm font-medium capitalize border transition-all duration-300 hover:shadow-md animate-fadeIn ${isHidden ? 'border-purple-300 hover:border-purple-500' : 'border-gray-200 hover:border-blue-400'}`}
                          style={{ animationDelay: `${index * 0.15 + 0.2}s` }}
                        >
                          <div className="flex items-center">
                            {isHidden ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="mr-1 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-md">Cachée</span>
                              </>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            )}
                            <span className="capitalize">{translatedName}</span>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                </div>

                {/* Sprites alternatifs */}
                <div className="mt-8 animate-fadeIn" style={{animationDelay: '0.6s'}}>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 border-b-2 border-gray-200 pb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Autres vues
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 justify-center bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
                    {pokemon.sprites.front_default && (
                      <div className="sprite-card animate-fadeIn" style={{animationDelay: '0.7s'}}>
                        <div className="bg-white/90 p-2 sm:p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100 flex flex-col items-center">
                          <div className="bg-gray-50/50 rounded-lg p-1 w-full flex justify-center items-center">
                            <Image 
                              src={pokemon.sprites.front_default} 
                              alt={`${frenchName} face`} 
                              width={70} 
                              height={70} 
                              className="object-contain mx-auto"
                            />
                          </div>
                          <p className="text-center text-xs mt-2 font-medium text-gray-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Face
                          </p>
                        </div>
                      </div>
                    )}
                    {pokemon.sprites.back_default && (
                      <div className="sprite-card animate-fadeIn" style={{animationDelay: '0.8s'}}>
                        <div className="bg-white/90 p-2 sm:p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100 flex flex-col items-center">
                          <div className="bg-gray-50/50 rounded-lg p-1 w-full flex justify-center items-center">
                            <Image 
                              src={pokemon.sprites.back_default} 
                              alt={`${frenchName} dos`} 
                              width={70} 
                              height={70} 
                              className="object-contain mx-auto"
                            />
                          </div>
                          <p className="text-center text-xs mt-2 font-medium text-gray-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Dos
                          </p>
                        </div>
                      </div>
                    )}
                    {pokemon.sprites.front_shiny && (
                      <div className="sprite-card animate-fadeIn" style={{animationDelay: '0.9s'}}>
                        <div className="bg-white/90 p-2 sm:p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100 flex flex-col items-center">
                          <div className="bg-gray-50/50 rounded-lg p-1 w-full flex justify-center items-center">
                            <Image 
                              src={pokemon.sprites.front_shiny} 
                              alt={`${frenchName} shiny face`} 
                              width={70} 
                              height={70} 
                              className="object-contain mx-auto"
                            />
                          </div>
                          <p className="text-center text-xs mt-2 font-medium text-gray-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Shiny face
                          </p>
                        </div>
                      </div>
                    )}
                    {pokemon.sprites.back_shiny && (
                      <div className="sprite-card animate-fadeIn" style={{animationDelay: '1s'}}>
                        <div className="bg-white/90 p-2 sm:p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100 flex flex-col items-center">
                          <div className="bg-gray-50/50 rounded-lg p-1 w-full flex justify-center items-center">
                            <Image 
                              src={pokemon.sprites.back_shiny} 
                              alt={`${frenchName} shiny dos`} 
                              width={70} 
                              height={70} 
                              className="object-contain mx-auto"
                            />
                          </div>
                          <p className="text-center text-xs mt-2 font-medium text-gray-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4" />
                            </svg>
                            Shiny dos
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // Récupérer les 100 premiers Pokémon pour générer les chemins
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
  const data = await res.json();
  
  // Créer les chemins pour chaque Pokémon
  const paths = data.results.map(pokemon => ({
    params: { name: pokemon.name },
  }));
  
  return {
    paths,
    fallback: 'blocking', // Générer les pages à la demande si elles n'existent pas
  };
}

export async function getStaticProps({ params }) {
  try {
    // Récupérer les données du Pokémon spécifique
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.name}`);
    if (pokemonRes.status === 404) return { notFound: true };
    const pokemon = await pokemonRes.json();
    
    // Récupération minimale des données d'espèce pour le rendu initial
    const speciesRes = await fetch(pokemon.species.url);
    const species = await speciesRes.json();
    
    // Extraction de la description en français (avec fallback anglais)
    const description = species.flavor_text_entries.find(entry => entry.language.name === 'fr')?.flavor_text
      || species.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || '';
    
    // Extraction du nom français (avec fallback au nom par défaut)
    const frenchName = species.names.find(name => name.language.name === 'fr')?.name || pokemon.name;
    
    // Nous ne récupérons pas la chaîne d'évolution côté serveur pour optimiser
    // Elle sera chargée côté client avec mise en cache
    
    return { 
      props: { 
        pokemon, 
        species, 
        evolutionChain: null, // Sera chargé côté client
        description, 
        frenchName 
      }, 
      revalidate: 86400 // Revalidation toutes les 24 heures
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données Pokémon:', error);
    return { notFound: true };
  }
}
