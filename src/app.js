import Bookmarks from './components/widgets/bookmarks';
import MapInfo from './components/widgets/info';
import MyMap from './components/widgets/map';
import Navbar from './components/ui/navbar';
import { useSelector } from 'react-redux';


function App() {
    const appState = useSelector(state => state);
    return (
        <div className="App">
            <Navbar />
            <MyMap />
            {appState.login.isLogged && <MapInfo />}
            {appState.bookmarks.visibility && appState.login.isLogged && <Bookmarks />}
        </div>
    );
};

export default App;
