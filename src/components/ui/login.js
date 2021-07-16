import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
import {
    useSelector,
    useDispatch
} from 'react-redux';
import {
    triggerShowLogin,
    triggerLogin
} from "../../actions";
const LoginModal = () => {
    const showLogin = useSelector(state => state.login.showLoginModal);
    const dispatch = useDispatch();
    const handleHide = () => {
        dispatch(triggerShowLogin(false));
    };
    const handleLogin = () => {
        dispatch(triggerLogin(true));
        dispatch(triggerShowLogin(false));
    };
    return (
        <Modal show={showLogin} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please provider username & password</p>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleHide}>Dismiss</Button>
                <Button variant="primary" onClick={handleLogin}>Login</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default LoginModal;