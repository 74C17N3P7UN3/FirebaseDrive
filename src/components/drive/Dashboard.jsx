import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

import { useFolder } from '../../hooks/useFolder'

import AddFolderBtn from './AddFolderBtn'
import Folder from './Folder'
import Navbar from './Navbar'

const Dashboard = () => {
   const { folderId } = useParams()
   const { folder, childFolders } = useFolder(folderId)

   return (
      <>
         <Navbar />
         <Container fluid>
            <AddFolderBtn currentFolder={folder} />
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
