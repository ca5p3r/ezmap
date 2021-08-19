import AppContainer from './appContainer';
import Navbar from './widgets/navbar';
import {
    useSelector
} from 'react-redux';
import LandingPage from './containers/landing';
import Loading from './containers/loader';
import MyToast from './containers/toast';
function App() {
    const login = useSelector(state => state.login.isLogged);
    const isLoading = useSelector(state => state.mapInfo.isLoading);
    return (
        <div className="App">
            <Navbar />
            {isLoading && <Loading />}
            {login ? <AppContainer /> : <LandingPage />}
            <MyToast />
        </div>
    );
};
export default App;
