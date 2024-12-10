import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href")?.substring(1); // Récupère l'id (sans #)
    const targetElement = targetId ? document.getElementById(targetId) : null;

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  console.log("Rendering HomePage...");
  return (
    <header id='header' className='header'>
      <Navbar expand="lg" className="bg-secondary ">
        <Container>
          <Navbar.Brand className='text-warning' href="#home">40k News</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className='text-light' as={Link} to="/">Accueil</Nav.Link>
              <Nav.Link className='text-light' as={Link} to="/#section" onClick={handleNavClick}>Section</Nav.Link>
              <Nav.Link className='text-light' as={Link} to="/#galerie" onClick={handleNavClick}>Galerie</Nav.Link>
              {/* {connected && User.Roles.includes('ROLE_ADMIN') */}
              <Nav.Link className='text-light' as={Link} to="/dashboard">Espace Admin</Nav.Link>
              {/* } */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
