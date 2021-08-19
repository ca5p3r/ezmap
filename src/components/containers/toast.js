import { Toast } from "react-bootstrap";
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { triggerToast } from "../../actions";
const MyToast = () => {
    const dispatch = useDispatch();
    const toastInfo = useSelector(state => state.toast);
    return (
        <div className="toast-message">
            <Toast className={`bg-${toastInfo.color}`} onClose={() => dispatch(triggerToast())} show={toastInfo.visibility} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{toastInfo.title}</strong>
                </Toast.Header>
                <Toast.Body>{toastInfo.message}</Toast.Body>
            </Toast>
        </div>
    );
};
export default MyToast;