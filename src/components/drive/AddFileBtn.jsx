import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../../contexts/AuthContext'
import { database, storage } from '../../firebase'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import { addDoc } from 'firebase/firestore'

const AddFileBtn = ({ currentFolder }) => {
   const { currentUser } = useAuth()

   const handleUpload = (e) => {
      const file = e.target.files[0]

      if (currentFolder == null || file == null) return

      const treePath = currentFolder.path.map(e => e.name).join('/')
      const filePath = currentFolder !== ROOT_FOLDER
         ? `${treePath}/${currentFolder.name}/${file.name}`
         : file.name

      const uploadTask = uploadBytesResumable(
         ref(storage, `/files/${currentUser.uid}/${filePath}`),
         file
      )

      uploadTask.on('state_changed',
         (snapshot) => {
            //
         },
         (error) => {
            //
         },
         () => {
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
   )
}

export default AddFileBtn
