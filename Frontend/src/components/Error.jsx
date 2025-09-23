import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {
 const navigate = useNavigate()

 return (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-white">
   <img
    src="/500Server.png"
    alt="Error illustration"
    className="w-64 h-64 mb-6"
   />
   <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
   <p className="text-gray-600 mb-6">
    Don't worry, we're already looking into it.
   </p>
   <button
    onClick={() => navigate(-1)}
    className="bg-black text-white px-6 py-2 rounded-xl shadow hover:bg-gray-800 transition"
   >
    Go Back
   </button>
  </div>
 )
}
