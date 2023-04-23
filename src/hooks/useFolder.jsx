import {
   and,
   doc,
   getDoc,
   onSnapshot,
   query,
   where,
} from 'firebase/firestore'
import { useEffect, useReducer } from 'react'

import { useAuth } from '../contexts/AuthContext'
import { database } from '../firebase'

const ACTIONS = {
   SELECT_FOLDER: 'SELECT_FOLDER',
   SET_CHILD_FILES: 'SET_CHILD_FILES',
   SET_CHILD_FOLDERS: 'SET_CHILD_FOLDERS',
   UPDATE_FOLDER: 'UPDATE_FOLDER',
}

export const ROOT_FOLDER = { name: 'Root', id: null, path: [] }

const reducer = (state, { type, payload }) => {
   switch (type) {
      case ACTIONS.SELECT_FOLDER:
         return {
            childFiles: [],
            childFolders: [],
            folder: payload.folder,
            folderId: payload.folderId,
         }
      case ACTIONS.SET_CHILD_FILES:
         return {
            ...state,
            childFiles: payload.childFiles,
         }
      case ACTIONS.SET_CHILD_FOLDERS:
         return {
            ...state,
            childFolders: payload.childFolders,
         }
      case ACTIONS.UPDATE_FOLDER:
         return {
            ...state,
            folder: payload.folder,
         }
      default:
         return state
   }
}

export const useFolder = (folder = null, folderId = null) => {
   const { currentUser } = useAuth()

   const [state, dispatch] = useReducer(reducer, {
      childFiles: [],
      childFolders: [],
      folder,
      folderId,
   })

   // SELECT_FOLDER
   useEffect(() => {
      dispatch({
         type: ACTIONS.SELECT_FOLDER,
         payload: { folder, folderId }
      })
   }, [folder, folderId])

   // SET_CHILD_FILES
   useEffect(() => {
      const condition = and(
         where('folderId', '==', folderId),
         where('userId', '==', currentUser.uid)
      )
      const q = query(database.files, condition)

      return onSnapshot(q, (snapshot) => {
         dispatch({
            type: ACTIONS.SET_CHILD_FILES,
            payload: {
               childFiles: snapshot.docs
                  .map(database.formatDoc)
                  .sort((a, b) => a.name.localeCompare(b.name)),
            }
         })
      })
   }, [currentUser, folderId])

   // SET_CHILD_FOLDERS
   useEffect(() => {
      const condition = and(
         where('parentId', '==', folderId),
         where('userId', '==', currentUser.uid)
      )
      const q = query(database.folders, condition)

      return onSnapshot(q, (snapshot) => {
         dispatch({
            type: ACTIONS.SET_CHILD_FOLDERS,
            payload: {
               childFolders: snapshot.docs
                  .map(database.formatDoc)
                  .sort((a, b) => a.name.localeCompare(b.name)),
            }
         })
      })
   }, [currentUser, folderId])

   // UPDATE_FOLDER
   useEffect(() => {
      if (folderId == null) {
         return dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: ROOT_FOLDER }
         })
      }

      getDoc(doc(database.folders, folderId)).then((doc) => {
         dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: database.formatDoc(doc) }
         })
      }).catch(() => {
         dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: ROOT_FOLDER }
         })
      })
   }, [folderId])

   return state
}
