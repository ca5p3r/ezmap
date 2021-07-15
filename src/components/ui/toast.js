import { Toast } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from '../../actions';
const MyToast = () => {
    const state = useSelector(state => state.toast);
    const dispatch = useDispatch();
    return (
        <div className="toast-message">
            <Toast className={`bg-${state.color}`} onClose={() => dispatch(hideToast())} show={state.visibility} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Alert</strong>
                </Toast.Header>
                <Toast.Body>{state.message}</Toast.Body>
            </Toast>
        </div>
    );
};
export default MyToast;