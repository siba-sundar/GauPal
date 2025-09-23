import {Outlet} from 'react-router-dom'
import UserNav from '../components/navbar/UserNav.jsx'

const User = () => {
  return (
    <>
    <UserNav />
    <Outlet />
    </>
  )
}

export default User