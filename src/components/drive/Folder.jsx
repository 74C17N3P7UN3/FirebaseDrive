import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

const Folder = ({ folder }) => (
   <Button as={Link} to={`/folder/${folder.id}`} variant='outline-dark' className='text-truncate w-100'>
      <FontAwesomeIcon icon={faFolder} style={{ marginRight: '10px' }} />
      {folder.name}
   </Button>
)

export default Folder
