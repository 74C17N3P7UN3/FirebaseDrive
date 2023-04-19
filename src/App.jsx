import { BrowserRouter, Route, Routes } from 'react-router-dom'

import {
   ForgotPassword,
   Login,
   Profile,
   Signup,
   UpdateProfile,

   Dashboard,
} from './components'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute, PublicRoute } from './routes'

const App = () => (
   <AuthProvider>
      <BrowserRouter>
         <Routes>
            {/* Auth */}
            <Route path='/login' element={
               <PublicRoute Component={Login} />
            } />
            <Route path='/signup' element={
               <PublicRoute Component={Signup} />
            } />
            <Route path='/forgot-password' element={
               <PublicRoute Component={ForgotPassword} />
            } />

            {/* Drive */}
            <Route exact path='/' element={
               <PrivateRoute Component={Dashboard} />
            } />
            <Route exact path='/folder/:folderId' element={
               <PrivateRoute Component={Dashboard} />
            } />

            {/* Profile */}
            <Route path='/update-profile' element={
               <PrivateRoute Component={UpdateProfile} />
            } />
            <Route path='/user' element={
               <PrivateRoute Component={Profile} />
            } />
         </Routes>
      </BrowserRouter>
   </AuthProvider>
)

export default App
