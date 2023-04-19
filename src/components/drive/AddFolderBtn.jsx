import { addDoc } from 'firebase/firestore'
import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../../contexts/AuthContext'
import { database } from '../../firebase'
import { ROOT_FOLDER } from '../../hooks/useFolder'

const AddFolderBtn = ({ currentFolder }) => {
   const [open, setOpen] = useState(false)
   const [name, setName] = useState('')

   const { currentUser } = useAuth()

   const openModal = () => setOpen(true)
   const closeModal = () => setOpen(false)

   const handleSubmit = (e) => {
      e.preventDefault()

      if (currentFolder == null) return

      const path = [...currentFolder.path]
      if (currentFolder !== ROOT_FOLDER)
         path.push({
            id: currentFolder.id,
            name: currentFolder.name,
         })

      addDoc(database.folders, {
         createdAt: database.timestamp(),
         name: name,
         parentId: currentFolder.id,
         path: path,
         userId: currentUser.uid,
      })

      setName('')
      closeModal()
   }

   return (
      <>
         <Button
            size='md'
            variant='outline-success'
            onClick={openModal}
         >
            <FontAwesomeIcon icon={faFolderPlus} />
         </Button>

         <Modal show={open} onHide={closeModal}>
            <Form onSubmit={handleSubmit}>
               <Modal.Body>
                  <Form.Group>
                     <Form.Label>Folder Name</Form.Label>
                     <Form.Control
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                     />
                  </Form.Group>
               </Modal.Body>
               <Modal.Footer>
                  <Button variant='secondary' onClick={closeModal}>
                     Close
                  </Button>
                  <Button variant='success' type='submit'>
                     Add Folder
                  </Button>
               </Modal.Footer>
            </Form>
         </Modal>
      </>
   )
}

export default AddFolderBtn
