import React from 'react';

const PokemonStats = ({ stats }) => {
  // Fonction pour obtenir la couleur de la barre de statistique en fonction de la valeur
  const getStatColor = (value) => {
    if (value < 50) return 'bg-red-500';
    if (value < 70) return 'bg-yellow-500';
    if (value < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Fonction pour traduire les noms des statistiques en français
  const translateStatName = (name) => {
    const translations = {
      'hp': 'PV',
      'attack': 'Attaque',
      'defense': 'Défense',
      'special-attack': 'Attaque Spé.',
      'special-defense': 'Défense Spé.',
      'speed': 'Vitesse'
    };
    return translations[name] || name;
  };
  
  // Fonction pour calculer le total des statistiques
  const calculateTotal = () => {
    return stats.reduce((total, stat) => total + stat.base_stat, 0);
  };
  
  // Fonction pour obtenir la classe de qualité en fonction du total
  const getTotalQualityClass = (total) => {
    if (total < 300) return 'text-red-600';
    if (total < 400) return 'text-orange-600';
    if (total < 500) return 'text-yellow-600';
    if (total < 600) return 'text-green-600';
    return 'text-blue-600 font-bold';
  };

  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-3 sm:p-4">
      <div className="space-y-2 sm:space-y-3">
        {stats.map((stat, index) => (
          <div key={stat.stat.name} className="stat-row" style={{animationDelay: `${0.1 + index * 0.1}s`}}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{translateStatName(stat.stat.name)}</span>
              <span className="text-sm font-medium text-gray-900">{stat.base_stat}</span>
            </div>
            <div className="stat-bar rounded-full overflow-hidden bg-gray-200 h-2.5 sm:h-3">
              <div 
                className={`h-full ${getStatColor(stat.base_stat)} transition-all duration-1000 ease-out stat-bar-fill`} 
                style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
        
        {/* Total des statistiques */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">Total</span>
            <span className={`text-sm font-bold ${getTotalQualityClass(calculateTotal())} transition-all duration-300 hover:scale-110`}>
              {calculateTotal()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonStats;
