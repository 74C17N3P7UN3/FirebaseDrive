import { Navigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

const PrivateRoute = ({ Component }) => {
   const { currentUser } = useAuth()

   return (
      currentUser ? <Component /> : <Navigate to='/login' />
   )
}

export default PrivateRoute
