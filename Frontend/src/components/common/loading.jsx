import React from 'react';
import { Loader2 } from 'lucide-react';

// Full Screen Loader
export const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
      <div className="text-center">
        <Loader2 
          className="mx-auto mb-4 animate-spin text-green-600" 
          size={48} 
        />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Inline Loader
export const InlineLoader = ({ 
  message = "Loading...", 
  size = 24, 
  textSize = "text-sm" 
}) => {
  return (
    <div className="flex items-center justify-center">
       
      
      <span className={`text-gray-600 ${textSize}`}>{message}</span>
    </div>
  );
};

// Overlay Loader
export const OverlayLoader = ({ message = "Loading..." }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
        <div className="text-center">
          <Loader2 
            className="mx-auto mb-2 animate-spin text-green-600" 
            size={32} 
          />
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Button Loader
export const ButtonLoader = ({ 
  loading, 
  children, 
  onClick, 
  className = "",
  loadingText = "Processing..." 
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <>
         
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Minimal Loader
export const MinimalLoader = ({ size = 24 }) => {
  return (
    <Loader2 
      className="animate-spin text-green-600" 
      size={size} 
    />
  );
};

// Change the default export to export the FullScreenLoader
export default FullScreenLoader;