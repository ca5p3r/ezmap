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
    triggerToast,
    triggerIsLoading
} from '../../actions';
import { contants } from '../../utils';
const backend_service = contants.backend_service;
const RegisterModal = () => {
    const dispatch = useDispatch();
    const showRegister = useSelector(state => state.register.visibility);
    const handleError = error => {
        dispatch(triggerToast({
            title: 'Danger',
            message: error.toString(),
            visible: true
        }));
        dispatch(triggerIsLoading());
    };
    const handleRegisterResponse = obj => {
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
        }
        dispatch(triggerIsLoading());
    }
    const handleRegister = (username, password) => {
        if (username.length >= 4 && username.length <= 16) {
            if (password.length >= 8 && password.length <= 20) {
                dispatch(triggerIsLoading(true));
                const data = { username, password };
                fetch(`http://${backend_service}/authService/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(obj => handleRegisterResponse(obj))
                    .catch(err => handleError(err))
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
                        <Form.Control type="password" placeholder="Password" onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                document.getElementById("registerButton").click();
                            }
                        }} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="registerButton" variant="primary" onClick={() => {
                    const username = document.getElementById('registerUsername').value;
                    const password = document.getElementById('registerPassword').value;
                    handleRegister(username, password);
                }}>Register</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default RegisterModal;