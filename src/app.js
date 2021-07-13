import Bookmarks from './components/widgets/bookmarks';
import MapInfo from './components/widgets/info';
import MyMap from './components/widgets/map';
import Navbar from './components/ui/navbar';
import { useSelector } from 'react-redux';
import LandingPage from './components/ui/landing';


function App() {
    const appState = useSelector(state => state);
    return (
        <div className="App">
            <Navbar />
            {!appState.login.isLogged && <LandingPage />}
            {appState.login.isLogged && <MyMap />}
            {appState.login.isLogged && <MapInfo />}
            {appState.bookmarks.visibility && appState.login.isLogged && <Bookmarks />}
        </div>
    );
};

export default App;
