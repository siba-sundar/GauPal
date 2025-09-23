import React from "react"; 
import { Link, useLocation, Navigate } from "react-router-dom"; 
 
const DiseaseNav = () => { 
  const location = useLocation(); 
  const currentPath = location.pathname;
  
  // Extract the user type from the current path (farmer or buyer)
  const pathParts = currentPath.split('/');
  const userType = pathParts[1]; // This will be 'farmer' or 'buyer'
  
  // Base path will be '/farmer/disease' or '/buyer/disease'
  const basePath = `/${userType}/disease`;
  
  // Check if we're at the root disease route and need to redirect
  if (currentPath === basePath) {
    return <Navigate to={`${basePath}/image`} replace />;
  }
   
  return ( 
    <div className="flex items-center gap-4 pb-4 pl-5 pt-10"> 
      <Link  
        to={`${basePath}/image`}  
        className={`px-4 py-2 rounded-lg transition-all ${ 
          currentPath === `${basePath}/image`  
            ? "bg-green-600 text-white font-medium"  
            : "text-gray-700 hover:bg-gray-100" 
        }`} 
      > 
        <span className="text-lg">Disease Symptoms</span> 
      </Link> 
       
      <Link  
        to={`${basePath}/question`}  
        className={`px-4 py-2 rounded-lg transition-all ${ 
          currentPath === `${basePath}/question`  
            ? "bg-green-600 text-white font-medium"  
            : "text-gray-700 hover:bg-gray-100" 
        }`} 
      > 
        <span className="text-lg">Disease QnA</span> 
      </Link> 
    </div> 
  ); 
}; 
 
export default DiseaseNav;