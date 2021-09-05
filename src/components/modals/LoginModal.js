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
    triggerToast,
    triggerIsLoading,
    setBookmarks,
    setMapZoom,
    setMapCenter,
    setDefaultExtent,
    setUser,
    setHistoricalLayers,
    setUserID
} from '../../actions';
const LoginModal = () => {
    const dispatch = useDispatch();
    const showLogin = useSelector(state => state.login.visibility);
    const load_settings = obj => {
        dispatch(setBookmarks(obj.config.bookmarks));
        dispatch(setMapZoom(obj.config.map.zoom));
        dispatch(setMapCenter(obj.config.map.center));
        dispatch(setDefaultExtent(obj.config.map.extent));
        dispatch(setHistoricalLayers(obj.config.map.layers));
    };
    const handleError = error => {
        dispatch(triggerToast({
            title: 'Danger',
            message: error.toString(),
            visible: true
        }));
    };
    const handleLogin = (username, password) => {
        if (username.length >= 4 && username.length <= 16) {
            if (password.length >= 8 && password.length <= 16) {
                dispatch(triggerIsLoading(true));
                const data = { username, password };
                fetch("http://localhost:9090/authService/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(loginObj => {
                        if (!loginObj.error) {
                            dispatch(setUser(username));
                            dispatch(setUserID(loginObj.userID));
                            const userObj = { id: loginObj.userID };
                            fetch("http://localhost:9090/configService/getSettings", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(userObj)
                            })
                                .then(response => response.json())
                                .then(settingsObj => {
                                    load_settings(settingsObj);
                                    dispatch(triggerLogin(true));
                                    dispatch(triggerShowLogin());
                                })
                                .catch(err => handleError(err))
                                .finally(
                                    dispatch(triggerIsLoading())
                                )
                        }
                        else {
                            dispatch(triggerToast({
                                title: 'Warning',
                                message: loginObj.error,
                                visible: true
                            }));
                        }
                    })
                    .catch(err => handleError(err))
                    .finally(
                        dispatch(triggerIsLoading())
                    )
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
                        <Form.Control type="password" placeholder="Password" onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                document.getElementById("loginButton").click();
                            }
                        }} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="loginButton" variant="primary" onClick={() => {
                    const username = document.getElementById('loginUsername').value;
                    const password = document.getElementById('loginPassword').value;
                    handleLogin(username, password);
                }}>Login</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default LoginModal;