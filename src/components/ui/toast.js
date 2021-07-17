import { Toast } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { triggerShowToast } from '../../actions';
const MyToast = () => {
    const state = useSelector(state => state.toast);
    const dispatch = useDispatch();
    return (
        <div className="toast-message">
            {console.log('Toast')}
            <Toast className={`bg-${state.color}`} onClose={() => dispatch(triggerShowToast(false))} show={state.visibility} delay={5000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{state.title}</strong>
                </Toast.Header>
                <Toast.Body>{state.message}</Toast.Body>
            </Toast>
        </div>
    );
};
export default MyToast;