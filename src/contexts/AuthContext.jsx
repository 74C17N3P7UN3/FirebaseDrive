import { createContext, useContext, useEffect, useState } from 'react'
import {
   createUserWithEmailAndPassword,
   onAuthStateChanged,
   sendPasswordResetEmail,
   signInWithEmailAndPassword,
   signOut,
   updateEmail,
   updatePassword,
} from 'firebase/auth'

import { auth } from '../firebase'

const AuthContext = createContext()

export const useAuth = () => {
   return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
   const [currentUser, setCurrentUser] = useState()
   const [loading, setLoading] = useState(true)

   const signup = (email, password) => {
      return createUserWithEmailAndPassword(auth, email, password)
   }

   const login = (email, password) => {
      return signInWithEmailAndPassword(auth, email, password)
   }

   const logout = () => {
      return signOut(auth)
   }

   const resetPassword = (email) => {
      return sendPasswordResetEmail(auth, email)
   }

   const updateUserEmail = (email) => {
      return updateEmail(currentUser, email)
   }

   const updateUserPassword = (password) => {
      return updatePassword(currentUser, password)
   }

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, user => {
         setCurrentUser(user)
         setLoading(false)
      })

      return unsubscribe
   }, [])

   const value = {
      currentUser,
      signup,
      login,
      logout,
      resetPassword,
      updateUserEmail,
      updateUserPassword,
   }

   return (
      <AuthContext.Provider value={value}>
         {!loading && children}
      </AuthContext.Provider>
   )
}
