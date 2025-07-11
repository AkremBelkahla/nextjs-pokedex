import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import PokemonCard from '../components/PokemonCard';
import PokemonModal from '../components/PokemonModal';
import TypeFilter from '../components/TypeFilter';
import pokeApi from '../services/pokeApi';

export default function Home({ initialPokemons }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [pokemons, setPokemons] = useState(initialPokemons);
  const [filteredPokemons, setFilteredPokemons] = useState(initialPokemons);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Fonction utilitaire pour afficher les détails d'un Pokémon
  const logPokemonDetails = (pokemon) => {
    console.log(`\n=== DÉTAILS DE ${pokemon.name.toUpperCase()} ===`);
    console.log('ID:', pokemon.id);
    console.log('Types (structure complète):', JSON.stringify(pokemon.types, null, 2));
    console.log('Sprites disponibles:', Object.keys(pokemon.sprites || {}));
    console.log('Image:', pokemon.imageUrl);
    
    // Afficher les types de manière plus lisible
    if (pokemon.types && Array.isArray(pokemon.types)) {
      console.log('Types extraits:', 
        pokemon.types
          .map(t => t?.type?.name)
          .filter(Boolean)
          .join(', ')
      );
    } else {
      console.log('Aucun type trouvé');
    }
    
    console.log('==============================\n');
  };

  // Fonction utilitaire pour afficher les détails d'un Pokémon spécifique avec des logs détaillés
  const logPokemonDetailsByName = (pokemons, name) => {
    console.log(`\n=== DÉBUT LOG DÉTAILLÉ POUR ${name.toUpperCase()} ===`);
    
    // Afficher le nombre total de Pokémon chargés
    console.log(`Nombre total de Pokémon chargés: ${pokemons.length}`);
    
    // Afficher les 5 premiers noms de Pokémon pour référence
    console.log('5 premiers Pokémon chargés:', pokemons.slice(0, 5).map(p => p.name).join(', '));
    
    // Trouver le Pokémon par son nom (insensible à la casse)
    const pokemon = pokemons.find(p => p.name.toLowerCase() === name.toLowerCase());
    
    if (pokemon) {
      console.log(`\n=== POKÉMON TROUVÉ: ${pokemon.name.toUpperCase()} ===`);
      console.log('ID:', pokemon.id);
      
      // Afficher les types de manière détaillée
      if (pokemon.types && Array.isArray(pokemon.types)) {
        console.log('\nTYPES DÉTAILLÉS:');
        pokemon.types.forEach((t, i) => {
          console.log(`  Type ${i + 1}:`);
          console.log('    - Nom:', t?.type?.name);
          console.log('    - URL:', t?.type?.url);
          console.log('    - Emplacement:', t.slot);
          console.log('    - Structure complète:', JSON.stringify(t, null, 2));
        });
      } else {
        console.log('Aucun type trouvé ou propriété types non définie');
      }
      console.log(`\n=== DONNÉES COMPLÈTES DE ${name.toUpperCase()} ===`);
      console.log('ID:', pokemon.id);
      console.log('Nom:', pokemon.name);
      
      // Afficher la structure complète des types
      console.log('\nStructure complète des types:', JSON.stringify(pokemon.types, null, 2));
      
      // Afficher les types de manière plus lisible
      if (pokemon.types && Array.isArray(pokemon.types)) {
        console.log('\nTypes extraits:');
        pokemon.types.forEach((t, i) => {
          console.log(`  Type ${i + 1}:`);
          console.log('    - Nom:', t?.type?.name);
          console.log('    - URL:', t?.type?.url);
          console.log('    - Emplacement:', t.slot);
        });
      } else {
        console.log('Aucun type trouvé ou propriété types non définie');
      }
      
      // Afficher d'autres propriétés utiles
      console.log('\nAutres propriétés:');
      console.log('  - Poids:', pokemon.weight);
      console.log('  - Taille:', pokemon.height);
      console.log('  - Expérience de base:', pokemon.base_experience);
      
      // Afficher les sprites disponibles
      if (pokemon.sprites) {
        console.log('\nSprites disponibles:');
        Object.entries(pokemon.sprites).forEach(([key, value]) => {
          if (value) {
            console.log(`  - ${key}:`, value);
          }
        });
      }
      
      // Extraire et afficher les noms des types
      const typeNames = [];
      if (pokemon.types && Array.isArray(pokemon.types)) {
        pokemon.types.forEach((typeObj, index) => {
          console.log(`\nType ${index + 1}:`);
          console.log('  Slot:', typeObj.slot);
          console.log('  Type:', typeObj.type);
          
          if (typeObj.type && typeObj.type.name) {
            typeNames.push(typeObj.type.name);
          }
        });
      }
      
      console.log('\nNoms des types extraits:', typeNames.join(', ') || 'Aucun type');
      console.log('==============================\n');
    } else {
      console.log(`Pokémon "${name}" non trouvé`);
    }
  };

  // Fonction utilitaire pour tester le filtre de type
  const testTypeFilter = (pokemonList) => {
    if (!pokemonList || !Array.isArray(pokemonList)) {
      console.log('Liste de Pokémon invalide pour le test de filtre');
      return;
    }
    
    console.log('\n=== TEST DU FILTRE DE TYPE ===');
    
    // Tester avec différents types connus
    const testTypes = ['water', 'fire', 'grass', 'electric'];
    
    testTypes.forEach(type => {
      console.log(`\nTest avec le type: ${type}`);
      
      // Filtrer les Pokémon de ce type
      const filtered = pokemonList.filter(pokemon => {
        if (!pokemon.types || !Array.isArray(pokemon.types)) return false;
        
        return pokemon.types.some(t => 
          t?.type?.name?.toLowerCase() === type.toLowerCase()
        );
      });
      
      console.log(`Nombre de Pokémon de type ${type}: ${filtered.length}`);
      
      // Afficher les 3 premiers pour vérification
      if (filtered.length > 0) {
        console.log('Exemples:', filtered.slice(0, 3).map(p => p.name).join(', '));
      }
    });
    
    console.log('==============================\n');
  };

  // Fonction utilitaire pour afficher le contenu complet d'un Pokémon
  const logCompletePokemonData = (pokemon) => {
    if (!pokemon) return;
    
    console.log('\n=== CONTENU COMPLET DU POKÉMON ===');
    console.log('Nom:', pokemon.name);
    console.log('ID:', pokemon.id);
    
    // Afficher toutes les propriétés du Pokémon
    console.log('\nPROPRIÉTÉS:');
    Object.keys(pokemon).forEach(key => {
      const value = pokemon[key];
      if (value === undefined || value === null) {
        console.log(`  ${key}:`, value);
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          console.log(`  ${key} (Array[${value.length}]):`);
          if (value.length > 0) {
            console.log('    ', value);
          }
        } else {
          console.log(`  ${key} (Object):`);
          console.log('    ', value);
        }
      } else {
        console.log(`  ${key}:`, value);
      }
    });
    
    console.log('==============================\n');
  };

  // Fonction utilitaire pour afficher la structure complète d'un Pokémon de type Eau
  const logWaterPokemonStructure = (pokemons) => {
    console.log('\n=== STRUCTURE D\'UN POKÉMON DE TYPE EAU ===');
    
    // Trouver le premier Pokémon de type Eau
    const waterPokemon = pokemons.find(pokemon => 
      pokemon.types?.some(t => t?.type?.name?.toLowerCase() === 'water')
    );
    
    if (!waterPokemon) {
      console.log('Aucun Pokémon de type Eau trouvé');
      return;
    }
    
    // Afficher le contenu complet du Pokémon de type Eau
    logCompletePokemonData(waterPokemon);
    
    console.log(`\nSTRUCTURE DE ${waterPokemon.name.toUpperCase()}:`);
    console.log(JSON.stringify(waterPokemon, (key, value) => {
      // Éviter d'afficher les tableaux trop longs
      if (Array.isArray(value) && value.length > 3) {
        return `[Array(${value.length})]`;
      }
      return value;
    }, 2));
    
    console.log('\nTYPES:');
    if (waterPokemon.types && Array.isArray(waterPokemon.types)) {
      waterPokemon.types.forEach((t, i) => {
        console.log(`  Type ${i + 1}:`);
        console.log('    - Structure complète:', JSON.stringify(t, null, 2));
        console.log('    - Nom du type:', t?.type?.name);
        console.log('    - URL du type:', t?.type?.url);
      });
    } else {
      console.log('Aucun type trouvé');
    }
    
    console.log('==============================\n');
  };

  // Fonction utilitaire pour afficher les détails d'un Pokémon de type Eau
  const logWaterPokemonDetails = (pokemons) => {
    console.log('\n=== RECHERCHE DE POKÉMON DE TYPE EAU ===');
    
    // Afficher tous les types disponibles dans les 10 premiers Pokémon
    console.log('\nTYPES DISPONIBLES DANS LES 10 PREMIERS POKÉMON:');
    const allTypes = new Set();
    pokemons.slice(0, 10).forEach((p, i) => {
      if (p.types && Array.isArray(p.types)) {
        p.types.forEach(t => {
          if (t?.type?.name) {
            allTypes.add(t.type.name);
          }
        });
      }
    });
    console.log('Types uniques trouvés:', Array.from(allTypes).join(', '));
    
    // Trouver les Pokémon de type Eau
    const waterPokemons = pokemons.filter(pokemon => 
      pokemon.types?.some(t => t?.type?.name?.toLowerCase() === 'water')
    );
    
    console.log(`\nNombre de Pokémon de type Eau trouvés: ${waterPokemons.length}`);
    
    if (waterPokemons.length === 0) {
      console.log('Aucun Pokémon de type Eau trouvé. Vérifiez la structure des données:');
      
      // Afficher la structure des types d'un Pokémon aléatoire
      const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
      console.log('\nStructure des types d\'un Pokémon aléatoire:');
      console.log('Nom:', randomPokemon.name);
      console.log('Types:', randomPokemon.types);
      
      // Afficher les 5 premiers Pokémon et leurs types
      console.log('\n5 premiers Pokémon et leurs types:');
      pokemons.slice(0, 5).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name}:`, 
          p.types?.map(t => t?.type?.name).filter(Boolean).join(', ') || 'Aucun type');
      });
    } else {
      // Afficher les détails des 3 premiers Pokémon de type Eau
      waterPokemons.slice(0, 3).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name.toUpperCase()}:`);
        
        // Afficher les types avec plus de détails
        if (p.types && Array.isArray(p.types)) {
          console.log('   Types:');
          p.types.forEach((t, j) => {
            console.log(`     - Type ${j + 1}: ${t?.type?.name || 'Inconnu'}`);
            console.log('       Structure complète:', JSON.stringify(t, null, 2));
          });
        } else {
          console.log('   Aucun type défini');
        }
        
        // Afficher l'URL de l'image
        console.log('   Image:', p.imageUrl || 'Non disponible');
        
        // Afficher l'ID pour référence
        console.log('   ID:', p.id);
      });
    }
    
    console.log('==============================\n');
  };

  // Fonction utilitaire pour afficher les détails de tous les types de Pokémon
  const logAllPokemonTypes = (pokemons) => {
    console.log('\n=== ANALYSE DE TOUS LES TYPES DE POKÉMON ===');
    
    // Obtenir tous les types uniques
    const typeCounts = {};
    const pokemonByType = {};
    
    pokemons.forEach(pokemon => {
      if (pokemon.types && Array.isArray(pokemon.types)) {
        pokemon.types.forEach(t => {
          const typeName = t?.type?.name;
          if (typeName) {
            // Compter les occurrences de chaque type
            typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
            
            // Garder une trace des Pokémon pour chaque type
            if (!pokemonByType[typeName]) {
              pokemonByType[typeName] = [];
            }
            if (pokemonByType[typeName].length < 3) {
              pokemonByType[typeName].push(pokemon.name);
            }
          }
        });
      }
    });
    
    // Afficher les statistiques des types
    console.log('\nSTATISTIQUES DES TYPES:');
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`- ${type}: ${count} Pokémon (ex: ${pokemonByType[type].join(', ')})`);
    });
    
    // Vérifier spécifiquement le type 'water'
    console.log('\nVÉRIFICATION DU TYPE "water":');
    if (typeCounts['water']) {
      console.log(`- Type 'water' trouvé avec ${typeCounts['water']} Pokémon`);
      console.log(`  Exemples: ${pokemonByType['water'].join(', ')}`);
      
      // Afficher la structure complète d'un Pokémon de type eau
      const waterPokemon = pokemons.find(p => 
        p.types?.some(t => t?.type?.name === 'water')
      );
      
      if (waterPokemon) {
        console.log('\nSTRUCTURE D\'UN POKÉMON DE TYPE EAU:');
        console.log(JSON.stringify({
          name: waterPokemon.name,
          id: waterPokemon.id,
          types: waterPokemon.types?.map(t => ({
            slot: t.slot,
            type: {
              name: t.type?.name,
              url: t.type?.url
            }
          }))
        }, null, 2));
      }
    } else {
      console.log('- Type "water" non trouvé dans les données');
      
      // Afficher la structure des types d'un Pokémon aléatoire
      const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
      console.log('\nSTRUCTURE DES TYPES D\'UN POKÉMON ALÉATOIRE:');
      console.log(JSON.stringify({
        name: randomPokemon.name,
        id: randomPokemon.id,
        types: randomPokemon.types?.map(t => ({
          slot: t.slot,
          type: {
            name: t.type?.name,
            url: t.type?.url
          }
        }))
      }, null, 2));
    }
    
    console.log('==============================\n');
  };

  // Fonction utilitaire pour afficher la structure complète d'un Pokémon
  const logCompletePokemonStructure = (pokemon) => {
    if (!pokemon) return;
    
    console.log('\n=== STRUCTURE COMPLÈTE DU POKÉMON ===');
    console.log('Nom:', pokemon.name);
    console.log('ID:', pokemon.id);
    
    // Afficher la structure des types
    console.log('\nSTRUCTURE DES TYPES:');
    if (pokemon.types && Array.isArray(pokemon.types)) {
      console.log(`Nombre de types: ${pokemon.types.length}`);
      
      pokemon.types.forEach((t, i) => {
        console.log(`\nType ${i + 1}:`);
        
        // Afficher les propriétés directes
        console.log('  - Propriétés directes:', Object.keys(t || {}).join(', '));
        
        // Afficher la structure complète
        console.log('  - Structure complète:', JSON.stringify(t, null, 2));
        
        // Vérifier la structure de typeObj.type
        if (t && typeof t === 'object') {
          console.log('  - type existe?', 'type' in t);
          
          if ('type' in t) {
            console.log('  - type est un objet?', t.type && typeof t.type === 'object');
            
            if (t.type && typeof t.type === 'object') {
              console.log('  - Propriétés de type:', Object.keys(t.type).join(', '));
              console.log('  - type.name existe?', 'name' in t.type);
              console.log('  - type.name:', t.type.name);
              
              // Vérifier si le nom est accessible via différentes méthodes
              console.log('  - Accès alternatif à name:', 
                t.type?.name, 
                t['type']?.name, 
                t['type'] && t['type']['name']
              );
            }
          }
        }
      });
    } else {
      console.log('Aucun type trouvé ou types n\'est pas un tableau');
      console.log('Type de pokemon.types:', typeof pokemon.types);
    }
    
    // Afficher toutes les propriétés du Pokémon
    console.log('\nPROPRIÉTÉS DU POKÉMON:');
    console.log(Object.keys(pokemon).join(', '));
    
    // Afficher la structure complète
    console.log('\nSTRUCTURE COMPLÈTE (JSON):');
    console.log(JSON.stringify(pokemon, (key, value) => {
      // Éviter la boucle infinie avec les références circulaires
      if (key === 'sprites' && value && typeof value === 'object') {
        return Object.keys(value);
      }
      return value;
    }, 2));
    
    console.log('==============================\n');
  };

  useEffect(() => {
    const loadPokemonsWithCache = async () => {
      try {
        setLoading(true);
        const response = await pokeApi.getPokemonsList({ limit: 5 }); // Limité à 5 pour le débogage
        
        const enrichedPokemons = await Promise.all(
          response.results.map(async (pokemon) => {
            try {
              const id = pokemon.url.split('/')[6];
              // Récupérer les détails complets du Pokémon pour avoir accès aux sprites officiels et aux types
              const pokemonDetails = await pokeApi.getPokemonByName(pokemon.name);
              
              // Vérifier la structure des données reçues
              console.log(`Détails de ${pokemon.name}:`, pokemonDetails);
              console.log(`Types de ${pokemon.name}:`, pokemonDetails.types);
              
              // Afficher les détails du premier Pokémon
              if (id === '1') {
                console.log('=== DONNÉES COMPLÈTES DE BULBASAUR ===');
                console.log(JSON.stringify(pokemonDetails, null, 2));
                logPokemonDetails(pokemonDetails);
              }
              
              // Vérifier la structure des types
              console.log(`\n=== TYPES POUR ${pokemon.name.toUpperCase()} ===`);
              console.log('Structure complète des types:', JSON.stringify(pokemonDetails.types, null, 2));
              
              // Extraire les noms des types
              const types = [];
              if (pokemonDetails.types && Array.isArray(pokemonDetails.types)) {
                pokemonDetails.types.forEach((typeObj, index) => {
                  console.log(`Type ${index + 1}:`, typeObj);
                  if (typeObj && typeObj.type && typeObj.type.name) {
                    types.push({
                      slot: typeObj.slot,
                      type: {
                        name: typeObj.type.name,
                        url: typeObj.type.url
                      }
                    });
                  }
                });
              }
              
              console.log('Types extraits:', types);
              
              const pokemonData = {
                ...pokemon,
                id,
                sprites: pokemonDetails.sprites,
                types: types, // Utiliser les types extraits
                imageUrl: pokemonDetails.sprites.other?.['official-artwork']?.front_default || 
                         pokemonDetails.sprites.front_default ||
                         `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                detailUrl: `/pokemon/${pokemon.name}`
              };
              
              // Afficher les données complètes pour les premiers Pokémon
              if (id <= 10) {
                console.log(`\n=== DONNÉES COMPLÈTES POUR ${pokemon.name.toUpperCase()} ===`);
                console.log(JSON.stringify(pokemonData, null, 2));
                console.log('==============================\n');
              }
              
              // Afficher les détails du premier Pokémon pour le débogage
              if (id === '1') {
                console.log('Données du Pokémon:', pokemonData);
                console.log('Types du Pokémon:', pokemonData.types);
              }
              
              // Fonction utilitaire pour afficher les données brutes d'un Pokémon
              const logRawPokemonData = async (pokemonName) => {
                try {
                  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                  if (!response.ok) {
                    console.error(`Impossible de charger les données brutes pour ${pokemonName}:`, response.status);
                    return null;
                  }
                  const data = await response.json();
                  console.log(`\n=== DONNÉES BRUTES POUR ${pokemonName.toUpperCase()} ===`);
                  console.log('URL:', `https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                  console.log('Types:', data.types?.map(t => t?.type?.name).filter(Boolean).join(', ') || 'Aucun');
                  console.log('Structure complète des types:', JSON.stringify(data.types, null, 2));
                  console.log('Propriétés principales:', Object.keys(data).join(', '));
                  console.log('==============================\n');
                  return data;
                } catch (error) {
                  console.error(`Erreur lors du chargement des données brutes pour ${pokemonName}:`, error);
                  return null;
                }
              };

              // Fonction pour charger les données détaillées d'un Pokémon
              const fetchPokemonDetails = async (pokemon) => {
                try {
                  // Charger les données brutes pour Squirtle à des fins de débogage
                  if (pokemon.name === 'squirtle') {
                    await logRawPokemonData('squirtle');
                  }
                  
                  const response = await fetch(pokemon.url);
                  const data = await response.json();
                  
                  // Vérifier et formater les types
                  if (data.types && Array.isArray(data.types)) {
                    // Créer une copie profonde pour éviter de modifier les données d'origine
                    const formattedData = JSON.parse(JSON.stringify(data));
                    
                    // S'assurer que chaque type a la bonne structure
                    formattedData.types = formattedData.types.map(t => {
                      // Si le type est déjà correctement formaté, le laisser tel quel
                      if (t && typeof t === 'object' && 'type' in t && t.type && typeof t.type === 'object') {
                        return t;
                      }
                      
                      // Sinon, essayer de formater le type correctement
                      let typeName, typeUrl;
                      
                      // Si le type est une chaîne, l'utiliser comme nom
                      if (typeof t === 'string') {
                        typeName = t.toLowerCase();
                        typeUrl = `https://pokeapi.co/api/v2/type/${typeName}/`;
                      } 
                      // Si c'est un objet, essayer d'extraire les informations
                      else if (t && typeof t === 'object') {
                        // Si l'objet a une propriété 'type' qui est une chaîne
                        if (typeof t.type === 'string') {
                          typeName = t.type.toLowerCase();
                          typeUrl = `https://pokeapi.co/api/v2/type/${typeName}/`;
                        }
                        // Si l'objet a des propriétés name/url directement
                        else if (t.name) {
                          typeName = t.name.toLowerCase();
                          typeUrl = t.url || `https://pokeapi.co/api/v2/type/${typeName}/`;
                        }
                      }
                      
                      // Retourner la structure standard attendue
                      return {
                        slot: 1, // Valeur par défaut
                        type: {
                          name: typeName || 'unknown',
                          url: typeUrl || ''
                        }
                      };
                    }).filter(t => t && t.type && t.type.name);
                    
                    return formattedData;
                  }
                  
                  return data;
                } catch (error) {
                  console.error(`Erreur lors du chargement des détails de ${pokemon.name}:`, error);
                  return null;
                }
              };
              
              return fetchPokemonDetails(pokemon);
            } catch (error) {
              console.error(`Erreur lors du chargement des détails de ${pokemon.name}:`, error);
              const id = pokemon.url.split('/')[6];
              return {
                ...pokemon,
                id,
                imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                detailUrl: `/pokemon/${pokemon.name}`
              };
            }
          })
        );
        
        const pokemonsData = enrichedPokemons;
        setPokemons(pokemonsData);
        setFilteredPokemons(pokemonsData);
        
        // Afficher l'analyse complète des types de Pokémon
        logAllPokemonTypes(pokemonsData);
        
        // Afficher la structure complète d'un Pokémon de type Eau
        logWaterPokemonStructure(pokemonsData);
        
        // Afficher les détails des Pokémon de type Eau
        logWaterPokemonDetails(pokemonsData);
        
        // Afficher les détails de Squirtle pour débogage
        logPokemonDetailsByName(pokemonsData, 'squirtle');
        
        // Tester le filtre de type avec les données chargées
        testTypeFilter(pokemonsData);
        
        // Afficher les détails de Pokémon pour débogage
        setTimeout(() => {
          // Trouver un Pokémon de type Eau
          console.log('\n=== RECHERCHE D\'UN POKÉMON DE TYPE EAU ===');
          
          // Afficher les 10 premiers Pokémon pour vérification
          console.log('\n10 PREMIERS POKÉMON:');
          pokemonsData.slice(0, 10).forEach((p, i) => {
            const types = p.types?.map(t => t?.type?.name).filter(Boolean) || [];
            console.log(`${i + 1}. ${p.name} - Types: ${types.join(', ') || 'Aucun'}`);
          });
          
          // Chercher spécifiquement Squirtle et d'autres Pokémon de type Eau
          const testNames = ['squirtle', 'wartortle', 'blastoise', 'psyduck', 'golduck'];
          let waterPokemonFound = false;
          
          for (const name of testNames) {
            const pokemon = pokemonsData.find(p => p.name === name);
            if (pokemon) {
              console.log(`\n=== POKÉMON TROUVÉ: ${pokemon.name.toUpperCase()} ===`);
              const types = pokemon.types?.map(t => t?.type?.name).filter(Boolean) || [];
              console.log(`Types: ${types.join(', ') || 'Aucun'}`);
              console.log('Structure complète des types:', JSON.stringify(pokemon.types, null, 2));
              waterPokemonFound = true;
              
              // Afficher la structure complète pour Squirtle
              if (pokemon.name === 'squirtle') {
                logCompletePokemonStructure(pokemon);
              }
              
              break;
            }
          }
          
          if (!waterPokemonFound) {
            console.log('\nAUCUN POKÉMON DE TYPE EAU TROUVÉ PARMI LES NOMS TESTÉS');
            console.log('Noms testés:', testNames.join(', '));
          }
          
          // Afficher les 3 premiers Pokémon avec leurs types
          console.log('\n=== 3 PREMIERS POKÉMON ===');
          pokemonsData.slice(0, 3).forEach(p => {
            const types = p.types
              ?.map(t => t?.type?.name?.toLowerCase())
              .filter(Boolean)
              .join(', ') || 'Aucun';
              
            console.log(`\n${p.name} (ID: ${p.id}) - Types: ${types}`);
            
            // Afficher la structure des types pour le premier Pokémon
            if (p.id === 1) {
              console.log('Structure des types:', JSON.stringify(p.types, null, 2));
            }
          });
          console.log('==============================\n');
        }, 1000);
      } catch (error) {
        console.error("Erreur lors du chargement des Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (initialPokemons.length === 0) {
      loadPokemonsWithCache();
    }
  }, [initialPokemons]);

  const filterPokemons = useCallback((term = searchTerm, type = selectedType) => {
    console.log('=== NOUVEAU FILTRAGE ===');
    console.log('Terme de recherche:', `"${term}"`);
    console.log('Type sélectionné:', `"${type}"`);
    
    // Afficher les détails d'un Pokémon de type Eau pour référence
    if (pokemons.length > 0) {
      const testPokemon = pokemons.find(p => p.name === 'squirtle');
      if (testPokemon) {
        console.log('\n=== RÉFÉRENCE POUR DÉBOGAGE ===');
        console.log('Pokémon testé: Squirtle');
        const types = testPokemon.types?.map(t => t?.type?.name).filter(Boolean) || [];
        console.log(`Types: ${types.join(', ') || 'Aucun'}`);
        console.log('==============================\n');
      }
    }
    
    const filtered = pokemons.filter(pokemon => {
      // Vérifier la correspondance avec le terme de recherche (insensible à la casse)
      const searchMatch = pokemon.name.toLowerCase().includes(term.toLowerCase().trim());
      
      // Si pas de filtre de type, retourner la correspondance de recherche
      if (type === 'all') {
        return searchMatch;
      }
      
      // Vérifier si le Pokémon a des types valides
      if (!pokemon.types || !Array.isArray(pokemon.types) || pokemon.types.length === 0) {
        console.log(`${pokemon.name}: Aucun type valide`);
        return false;
      }
      
      // Vérifier si l'un des types correspond (méthode simplifiée et robuste)
      let hasMatchingType = false;
      
      try {
        // Méthode principale: vérifier chaque type
        for (const typeObj of pokemon.types) {
          if (!typeObj || typeof typeObj !== 'object') continue;
          
          // Vérifier si typeObj a une propriété 'type' avec un 'name'
          if (typeObj.type?.name?.toLowerCase() === type.toLowerCase()) {
            hasMatchingType = true;
            break;
          }
          
          // Vérifier si typeObj a directement un 'name' (au cas où la structure serait différente)
          if (typeObj.name?.toLowerCase() === type.toLowerCase()) {
            hasMatchingType = true;
            break;
          }
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification des types pour ${pokemon.name}:`, error);
        hasMatchingType = false;
      }
      
      // Si on filtre par type mais qu'aucun type ne correspond
      if (type !== 'all' && !hasMatchingType) {
        return false;
      }
      
      return searchMatch;
    });
    
    console.log(`Filtrage terminé: ${filtered.length} Pokémon correspondent aux critères`);
    setFilteredPokemons(filtered);
  }, [pokemons, searchTerm, selectedType]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterPokemons(term, selectedType);
  };

  const handleTypeSelect = (type) => {
    console.log('=== CHANGEMENT DE TYPE ===');
    console.log('Nouveau type sélectionné:', type);
    setSelectedType(type);
    
    // Afficher les types disponibles pour le débogage
    if (pokemons.length > 0) {
      console.log('\n=== TYPES DISPONIBLES ===');
      const allTypes = new Set();
      
      pokemons.forEach(p => {
        if (p.types && Array.isArray(p.types)) {
          p.types.forEach(t => {
            if (t?.type?.name) {
              allTypes.add(t.type.name.toLowerCase());
            }
          });
        }
      });
      
      console.log('Types uniques trouvés:', Array.from(allTypes).join(', '));
      console.log('========================\n');
    }
    
    filterPokemons(searchTerm, type);
  };

  const resetSearch = () => {
    setSearchTerm('');
    setSelectedType('all');
    setFilteredPokemons(pokemons);
  };
  
  const openPokemonModal = (pokemon) => {
    setSelectedPokemon(pokemon.name);
    setIsModalOpen(true);
  };
  
  const closePokemonModal = () => {
    setIsModalOpen(false);
    // Attendre la fin de l'animation de fermeture avant de réinitialiser
    setTimeout(() => setSelectedPokemon(null), 300);
  };

  return (
    <div className="pokeball-bg min-h-screen">
      <Head>
        <title>Pokédex Next.js</title>
        <meta name="description" content="Un Pokédex créé avec Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-5xl font-bold text-center mb-2 text-white relative inline-flex items-center justify-center gap-2">
            <span className="relative z-10 drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
              POKÉDEX
            </span>
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-red-600 rounded-full border-4 border-gray-900"></div>
              <div className="absolute inset-0 top-1/2 h-1/2 bg-white"></div>
              <div className="absolute inset-0 top-1/2 h-1 bg-gray-900"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-gray-900"></div>
            </div>
          </h1>
          <div className="h-1 w-24 bg-white rounded-full mt-2 shadow-glow"></div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Rechercher un Pokémon..."
                className="search-input w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button
                  onClick={resetSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-red-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <TypeFilter selectedType={selectedType} onTypeSelect={handleTypeSelect} />
        </div>

        {filteredPokemons.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white text-xl">Aucun Pokémon trouvé pour "{searchTerm}"</p>
            <button 
              onClick={resetSearch}
              className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full transition-all"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
            {filteredPokemons.map((pokemon) => (
              <div key={pokemon.name} className="aspect-square cursor-pointer" onClick={() => openPokemonModal(pokemon)}>
                <PokemonCard pokemon={pokemon} />
              </div>
            ))}
          </div>
        )}
        
        {/* Modal Pokémon */}
        {selectedPokemon && (
          <PokemonModal 
            isOpen={isModalOpen} 
            onClose={closePokemonModal} 
            pokemonName={selectedPokemon} 
          />
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  try {
    // Récupération des données initiales pour le rendu côté serveur
    // Ces données seront remplacées par celles du cache côté client
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const { results } = await res.json();
    
    // Enrichissement minimal pour le rendu initial
    const pokemonsWithDetails = results.map((pokemon) => {
      const id = pokemon.url.split('/')[6];
      return {
        ...pokemon,
        id,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        detailUrl: `/pokemon/${pokemon.name}`
      };
    });

    return {
      props: {
        initialPokemons: pokemonsWithDetails
      },
      revalidate: 86400 // Revalidate once per day
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données Pokémon:', error);
    return {
      props: {
        initialPokemons: []
      },
      revalidate: 60 // Réessayer plus tôt en cas d'erreur
    };
  }
}
