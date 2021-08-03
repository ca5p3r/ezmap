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
    triggerLogin,
    triggerToast
} from '../../actions';
const LoginModal = () => {
    const dispatch = useDispatch();
    const showLogin = useSelector(state => state.login.visibility);
    const handleLogin = (username, password) => {
        if (username.length >= 4 && username.length <= 16) {
            if (password.length >= 8 && password.length <= 16) {
                const data = { username, password };
                fetch("http://localhost:9000/auth/login", {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        return response.json();
                    })
                    .then(obj => {
                        if (!obj.error) {
                            dispatch(triggerLogin(true));
                            dispatch(triggerShowLogin());
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
        };
    };
    return (
        <Modal show={showLogin} onHide={() => dispatch(triggerShowLogin(!showLogin))}>
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
                            handleLogin(username, password);
                        }}>Login</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => dispatch(triggerShowLogin(!showLogin))}>Dismiss</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default LoginModal;