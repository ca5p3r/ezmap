import {
    Navbar,
    Nav,
    NavDropdown
} from "react-bootstrap";
import {
    useSelector,
    useDispatch
} from 'react-redux';
import LoginModal from "./login";
import WorkspaceModal from "./workspace";
import {
    showlogin,
    logout,
    showBookmarks,
    hideBookmarks,
    showWorkspace,
    hideWorkspace,
    showTOC,
    hideTOC
} from '../../actions';
const AppNavBar = () => {
    const isLogged = useSelector(state => state.login.isLogged);
    const dispatch = useDispatch();
    const handleShowLogin = () => {
        dispatch(showlogin());
    };
    const handleLogout = () => {
        dispatch(logout());
        dispatch(hideBookmarks());
        dispatch(hideWorkspace());
        dispatch(hideTOC());
    };
    const handleShowBookmarks = () => {
        dispatch(showBookmarks());
        dispatch(hideWorkspace());
        dispatch(hideTOC());
    };
    const handleShowWorkspace = () => {
        dispatch(showWorkspace());
        dispatch(hideBookmarks());
        dispatch(hideTOC());
    };
    const handleShowTOC = () => {
        dispatch(showTOC());
        dispatch(hideBookmarks());
        dispatch(hideWorkspace());
    };
    return (
        <Navbar bg="info" expand="lg">
            <Navbar.Brand>EasyMap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="menavbar-nav ml-auto">
                    {isLogged && <NavDropdown title="Map tools" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={handleShowBookmarks}>Bookmarks</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleShowWorkspace}>Layers manager</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleShowTOC}>Table of contents</NavDropdown.Item>
                    </NavDropdown>}
                    {!isLogged && <Nav.Link onClick={handleShowLogin}>Login</Nav.Link>}
                    {isLogged && <Nav.Link style={{ width: '70px' }} onClick={handleLogout}>Logout</Nav.Link>}
                </Nav>
            </Navbar.Collapse>
            <LoginModal />
            <WorkspaceModal />
        </Navbar>
    );
};
export default AppNavBar;