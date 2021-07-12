import Navbar from './components/ui/navbar';
import MyMap from './components/widgets/map';
import MapInfo from './components/widgets/info';
import Bookmarks from './components/widgets/bookmarks';
import { useSelector } from 'react-redux';


function App() {
    const bookmarksVisibility = useSelector(state => state.bookmarks.visibility);
    return (
        <div className="App">
            <Navbar />
            <MyMap />
            <MapInfo />
            {bookmarksVisibility && <Bookmarks />}
        </div>
    );
};

export default App;
