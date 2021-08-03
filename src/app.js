import MyMap from './components/map';
import Navbar from './components/navbar';
import {
    useSelector
} from 'react-redux';
import LandingPage from './components/landing';
import Loading from './components/widgets/loader';
import MyToast from './components/widgets/toast';
function App() {
    const login = useSelector(state => state.login.isLogged);
    const isLoading = useSelector(state => state.mapInfo.isLoading);
    return (
        <div className="App">
            <Navbar />
            {isLoading && <Loading />}
            {login ? <MyMap /> : <LandingPage />}
            <MyToast />
        </div>
    );
};
export default App;
