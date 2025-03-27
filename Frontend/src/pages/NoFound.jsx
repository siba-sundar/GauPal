import React from 'react'; 
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex  items-center justify-center bg-gray-100 space-y-6 max-[600px]:flex-col">
      <div className="w-[40vw] max-[600px]:w-[70vw]">
        <img 
          src="/404.png" 
          alt="404 Not Found" 
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="  text-center">
        <h1 className="text-[3vw] font-bold mb-4 max-[600px]:text-[5vw]">404 - Page Not Found</h1>
        <p className="mb-6 ">The page you are looking for doesn't exist or has been moved.</p>
        <button
          onClick={handleGoBack}
          className="bg-green-300 text-black font-semibold py-2 px-4 rounded-md hover:bg-green-600 hover:text-white"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;