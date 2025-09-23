import { Outlet } from "react-router-dom"
import FarmerNav from "../components/navbar/FarmerDashNav.jsx"

const FarmerDash = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex max-[1020px]:flex-col">
    <FarmerNav />
    <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
      <Outlet/>
    </main>
  </div>
  )
}

export default FarmerDash