import React from 'react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl md:text-6xl font-bold text-green-600 mb-4">Coming Soon</h1>
      <p className="text-xl text-gray-600 mb-8">We're working hard to bring you something amazing!</p>
      <div className="w-16 h-1 bg-green-600 rounded"></div>
    </div>
  );
};

export default ComingSoon;