import { Outlet } from "react-router-dom"
import FarmerNav from "../components/navbar/FarmerDashNav.jsx"

const FarmerDash = () => {
  return (
    <div>
      <FarmerNav />
      <Outlet />
    </div>
  )
}

export default FarmerDash