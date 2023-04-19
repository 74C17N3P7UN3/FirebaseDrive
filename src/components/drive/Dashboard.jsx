import { Container } from 'react-bootstrap'
import { useLocation, useParams } from 'react-router-dom'

import { useFolder } from '../../hooks/useFolder'

import {
   AddFolderBtn,
   Folder,
   FolderBreadcrumbs,
   Navbar,
} from './'

const Dashboard = () => {
   const { folderId } = useParams()
   const state = (useLocation().state !== null)
      ? useLocation().state
      : { folder: null }

   const { folder, childFolders } = useFolder(state.folder, folderId)

   return (
      <>
         <Navbar />
         <Container fluid className='px-5'>
            <div className='d-flex align-items-center my-2'>
               <FolderBreadcrumbs currentFolder={folder} />
               <AddFolderBtn currentFolder={folder} />
            </div>
            {childFolders.length > 0 && (
               <div className='d-flex flex-wrap'>
                  {childFolders.map(childFolder => (
                     <div
                        key={childFolder.id}
                        style={{ maxWidth: '250px' }}
                        className='p-2'
                     >
                        <Folder folder={childFolder} />
                     </div>
                  ))}
               </div>
            )}
         </Container>
      </>
   )
}

export default Dashboard
