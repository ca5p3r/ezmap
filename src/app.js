import MyMap from './components/widgets/map';
import Navbar from './components/ui/navbar';
import { useSelector } from 'react-redux';
import LandingPage from './components/ui/landing';
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
