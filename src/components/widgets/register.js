import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
const RegisterModal = (props) => {
    return (
        <Modal show={props.showRegister} onHide={props.handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please provider username & password</p>
                <Form>
                    <Form.Group className="mb-3" controlId="registerUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="registerPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicSubmit">
                        <Button variant="primary" onClick={() => {
                            let username = document.getElementById('registerUsername').value;
                            let password = document.getElementById('registerUsername').value;
                            props.handleRegister(username, password);
                        }}>Register</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleHide}>Dismiss</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default RegisterModal;