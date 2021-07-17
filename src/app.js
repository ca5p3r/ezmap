import MyMap from './components/map';
import Navbar from './components/navbar';
import { useSelector } from 'react-redux';
import LandingPage from './components/landing';
function App() {
    const login = useSelector(state => state.login.isLogged);
    return (
        <div className="App">
            <Navbar />
            {login ? <MyMap /> : <LandingPage />}
        </div>
    );
};
export default App;
