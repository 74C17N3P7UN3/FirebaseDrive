import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
   collection,
   serverTimestamp,
   getFirestore
} from 'firebase/firestore'

const app = initializeApp({
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
   appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

export const auth = getAuth(app)

const firestore = getFirestore(app)
export const database = {
   files: collection(firestore, 'files'),
   folders: collection(firestore, 'folders'),
   formatDoc: (doc) => {
      return {
         id: doc.id,
         ...doc.data(),
      }
   },
   timestamp: serverTimestamp,
}
