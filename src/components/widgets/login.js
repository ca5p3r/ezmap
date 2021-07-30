import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
const LoginModal = (props) => {
    return (
        <Modal show={props.showLogin} onHide={props.handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please provider username & password</p>
                <Form>
                    <Form.Group className="mb-3" controlId="loginUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="loginPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicSubmit">
                        <Button variant="primary" onClick={() => {
                            const username = document.getElementById('loginUsername').value;
                            const password = document.getElementById('loginPassword').value;
                            props.handleLogin(username, password);
                        }}>Login</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleHide}>Dismiss</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default LoginModal;