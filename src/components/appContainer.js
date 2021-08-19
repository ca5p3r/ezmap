import TOC from './widgets/toc';
import Bookmarks from './widgets/bookmarks';
import MapInfo from './containers/info';
import Identify from "./containers/identify";
import MyMap from "./widgets/map";
import {
    useSelector
} from "react-redux";

const AppContainer = () => {
    const showBookmark = useSelector(state => state.bookmarks.visibility);
    const showIdentify = useSelector(state => state.identify.visibility);
    const tocInfo = useSelector(state => state.toc);
    return (
        <div>
            <MyMap />
            {showBookmark && <Bookmarks />}
            {tocInfo.visibility && <TOC />}
            {showIdentify && <Identify />}
            <MapInfo />
        </div>
    );
};

export default AppContainer;