import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useState } from 'react'
import { ProgressBar, Toast } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import { v4 as uuidV4 } from 'uuid'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../../contexts/AuthContext'
import { database, storage } from '../../firebase'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import { addDoc } from 'firebase/firestore'

const AddFileBtn = ({ currentFolder }) => {
   const [uploadingFiles, setUploadingFiles] = useState([])

   const { currentUser } = useAuth()

   const handleUpload = (e) => {
      const file = e.target.files[0]

      if (currentFolder == null || file == null) return

      const id = uuidV4()
      setUploadingFiles((prev) => [...prev, {
         id: id,
         name: file.name,
         progress: 0,
         error: false,
      }])

      const treePath = currentFolder.path.map(e => e.name).join('/')
      const filePath = currentFolder !== ROOT_FOLDER
         ? `${treePath}/${currentFolder.name}/${file.name}`
         : file.name

      const uploadTask = uploadBytesResumable(
         ref(storage, `/files/${currentUser.uid}/${filePath}`),
         file
      )

      uploadTask.on('state_changed',
         (snap) => {
            const progress = snap.bytesTransferred / snap.totalBytes * 100
            setUploadingFiles((prev) => prev.map((file) => {
               if (file.id === id)
                  return { ...file, progress: progress }
               return file
            }))
         },
         (error) => {
            console.log(error)

            setUploadingFiles((prev) => prev.map((file) => {
               if (file.id === id)
                  return { ...file, error: true }
               return file
            }))
         },
         () => {
            setUploadingFiles((prev) => prev.filter((file) => file.id !== id))

            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               addDoc(database.files, {
                  createdAt: database.timestamp(),
                  folderId: currentFolder.id,
                  name: file.name,
                  url: downloadURL,
                  userId: currentUser.uid,
               })
            })
         }
      )
   }

   return (
      <>
         <label
            className='btn btn-md btn-outline-success'
            style={{ width: '50px', marginLeft: '10px' }}
         >
            <FontAwesomeIcon icon={faFileUpload} />
            <input
               type='file'
               onChange={handleUpload}
               style={{ display: 'none' }}
            />
         </label>

         {uploadingFiles.length > 0 && (
            ReactDOM.createPortal(
               <div style={{
                  position: 'absolute',
                  right: '1rem',
                  bottom: '1rem',
                  maxWidth: '250px',
               }}>
                  {uploadingFiles.map((file) => (
                     <Toast key={file.id} onClose={() => {
                        setUploadingFiles((prev) =>
                           prev.filter(file =>
                              file.id !== file.id
                           )
                        )
                     }}>
                        <Toast.Header
                           closeButton={file.error}
                           className='d-block text-truncate w-100'
                        >
                           {file.name}
                        </Toast.Header>
                        <Toast.Body>
                           <ProgressBar
                              animated={!file.error}
                              variant={file.error ? 'danger' : 'primary'}
                              now={file.error ? 100 : file.progress}
                              label={file.error
                                 ? 'Error'
                                 : `${file.progress.toFixed(1)}%`
                              }
                           />
                        </Toast.Body>
                     </Toast>
                  ))}
               </div>,
               document.body
            )
         )}
      </>
   )
}

export default AddFileBtn
