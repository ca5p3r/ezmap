import { Toast } from "react-bootstrap";
const MyToast = (props) => {
    return (
        <div className="toast-message">
            <Toast className={`bg-${props.color}`} onClose={props.triggerShowToast} show={props.visibility} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{props.title}</strong>
                </Toast.Header>
                <Toast.Body>{props.message}</Toast.Body>
            </Toast>
        </div>
    );
};
export default MyToast;