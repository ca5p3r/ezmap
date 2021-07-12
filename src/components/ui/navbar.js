import {
    Navbar,
    Nav,
    NavDropdown
} from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import LoginModal from "./login";
import { showlogin, logout, showBookmarks } from '../../actions';

const AppNavBar = () => {
    const isLogged = useSelector(state => state.login.isLogged);
    const dispatch = useDispatch();

    const handleModalShow = () => {
        dispatch(showlogin());
    };
    const handleLogout = () => {
        dispatch(logout());
    };

    const handleShowBookmarks = () => {
        dispatch(showBookmarks());
    };

    return (
        <Navbar bg="info" expand="lg">
            <Navbar.Brand>EasyMap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="menavbar-nav ml-auto">
                    {isLogged && <NavDropdown title="Map tools" id="basic-nav-dropdown">
                        <NavDropdown.Item>Table of contents</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleShowBookmarks}>Bookmarks</NavDropdown.Item>
                    </NavDropdown>}
                    {isLogged && <NavDropdown title="Advanced" id="basic-nav-dropdown">
                        <NavDropdown.Item>Layers manager</NavDropdown.Item>
                        <NavDropdown.Item>Map tweaks</NavDropdown.Item>
                    </NavDropdown>}
                    {!isLogged && <Nav.Link onClick={handleModalShow}>Login</Nav.Link>}
                    {isLogged && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
                </Nav>
            </Navbar.Collapse>
            <LoginModal />
        </Navbar>
    );
};

export default AppNavBar;