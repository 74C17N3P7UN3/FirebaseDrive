import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavbarComponent = () => (
   <Navbar bg='light' expand='*' className='px-5'>
      <Navbar.Brand as={Link} to='/'>
         Tacit's Drive
      </Navbar.Brand>
      <Nav.Link as={Link} to='/user'>
         Profile
      </Nav.Link>
   </Navbar>
)

export default NavbarComponent
