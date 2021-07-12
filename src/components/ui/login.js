import { Modal, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { hidelogin, login } from "../../actions";

const LoginModal = () => {
    const loginState = useSelector(state => state.login);
    const dispatch = useDispatch();

    const handleHide = () => {
        dispatch(hidelogin());
    };
    const handleLogin = () => {
        dispatch(login());
        dispatch(hidelogin());
    };

    return (
        <Modal show={loginState.showLoginModal} onHide={handleHide}>
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
}

export default LoginModal;