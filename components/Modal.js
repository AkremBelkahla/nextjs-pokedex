import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, description, children, size = 'md', headerClassName = '' }) {
  // Empêcher le défilement du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Différentes tailles de modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm transition-opacity animate-fadeIn">
      <div className="relative flex min-h-screen w-full items-center justify-center p-4">
        <div className={`${sizeClasses[size]} w-full rounded-xl bg-white shadow-2xl transform transition-all animate-scaleIn`}>
          {/* En-tête de la modal */}
          <div className={`border-b border-gray-200 px-6 py-4 ${headerClassName}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-white hover:bg-white/20 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {description && <p className="mt-1 text-sm text-white/90">{description}</p>}
          </div>
          
          {/* Contenu de la modal */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
