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
    triggerShowRegister,
    triggerToast
} from '../../actions';
const RegisterModal = () => {
    const dispatch = useDispatch();
    const showRegister = useSelector(state => state.register.visibility);
    const handleRegister = (username, password) => {
        if (username.length >= 4 && username.length <= 16) {
            if (password.length >= 8 && password.length <= 20) {
                const data = { username, password };
                fetch("http://localhost:9000/auth/create", {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(obj => {
                        if (!obj.error) {
                            dispatch(triggerShowRegister());
                            dispatch(triggerToast({
                                title: 'Success',
                                message: 'User has been created!',
                                visible: true
                            }));
                        }
                        else {
                            dispatch(triggerToast({
                                title: 'Warning',
                                message: obj.error,
                                visible: true
                            }));
                        };
                    })
                    .catch(err => {
                        dispatch(triggerToast({
                            title: 'Danger',
                            message: err.toString(),
                            visible: true
                        }));
                    });
            }
            else {
                dispatch(triggerToast({
                    title: 'Warning',
                    message: 'Password should be of length 8-20',
                    visible: true
                }));
            }
        }
        else {
            dispatch(triggerToast({
                title: 'Warning',
                message: 'Username should be of length 4-16',
                visible: true
            }));
        }
    };
    return (
        <Modal show={showRegister} onHide={() => dispatch(triggerShowRegister(!showRegister))}>
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
                            const username = document.getElementById('registerUsername').value;
                            const password = document.getElementById('registerPassword').value;
                            handleRegister(username, password);
                        }}>Register</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => dispatch(triggerShowRegister(!showRegister))}>Dismiss</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default RegisterModal;