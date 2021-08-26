import { Toast } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { triggerToast } from "../../actions";
const MyToast = () => {
  const dispatch = useDispatch();
  const color = useSelector(state => state.toast.color);
  const visibility = useSelector(state => state.toast.visibility);
  const title = useSelector(state => state.toast.title);
  const message = useSelector(state => state.toast.message);
  return (
    <div className="toast-message">
      <Toast
        className={`bg-${color}`}
        onClose={() => dispatch(triggerToast())}
        show={visibility}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </div>
  );
};
export default MyToast;
