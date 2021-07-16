import Bookmarks from './components/widgets/bookmarks';
import MapInfo from './components/widgets/info';
import MyMap from './components/widgets/map';
import Navbar from './components/ui/navbar';
import { useSelector } from 'react-redux';
import LandingPage from './components/ui/landing';
import TOC from './components/widgets/toc';
import MyToast from './components/ui/toast';
import FontAwesomeLicense from './components/ui/license';
function App() {
    const login = useSelector(state => state.login.isLogged);
    const showBookmark = useSelector(state => state.bookmarks.visibility);
    const showTOC = useSelector(state => state.toc.visibility);
    return (
        <div className="App">
            <Navbar />
            {!login && <LandingPage />}
            {login && <>
                <MyMap />
                <MapInfo />
                <MyToast />
                {showBookmark && <Bookmarks />}
                {showTOC && <TOC />}
            </>}
            <FontAwesomeLicense />
        </div>
    );
};
export default App;
