import MyMap from './components/map';
import Navbar from './components/navbar';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import LandingPage from './components/landing';
import Loading from './components/widgets/loader';
import MyToast from './components/widgets/toast';
import { triggerToast } from "./actions";
function App() {
    const dispatch = useDispatch();
    const login = useSelector(state => state.login.isLogged);
    const isLoading = useSelector(state => state.mapInfo.isLoading);
    const toastInfo = useSelector(state => state.toast);
    const handleToastTrigger = () => {
        dispatch(triggerToast());
    };
    return (
        <div className="App">
            <Navbar />
            {isLoading && <Loading />}
            {login ? <MyMap /> : <LandingPage />}
            {toastInfo.visibility && <MyToast triggerShowToast={handleToastTrigger} color={toastInfo.color} visibility={toastInfo.visibility} title={toastInfo.title} message={toastInfo.message} />}
        </div>
    );
};
export default App;
