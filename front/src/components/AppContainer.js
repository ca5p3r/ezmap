import TOC from "./widgets/TOC";
import Bookmarks from "./widgets/Bookmarks";
import MapInfo from "./containers/MapInfo";
import Identify from "./containers/Identify";
import SpatialSearch from "./containers/SpatialSearch";
import MyMap from "./widgets/MyMap";
import { useSelector } from "react-redux";
import WorkspaceModal from "./modals/WorkspaceModal";
import LocalizationModal from "./modals/LocalizationModal";
import SimpleSearch from "./widgets/SimpleSearch";
const AppContainer = () => {
  const showBookmark = useSelector(state => state.bookmarks.visibility);
  const showIdentify = useSelector(state => state.identify.visibility);
  const showSpatialSearch = useSelector(state => state.spatialSearch.visibility);
  const showTOC = useSelector(state => state.toc.visibility);
  const showSimpleSearch = useSelector(state => state.simpleSearch.visibility);
  return (
    <div className="layout-container">
      <WorkspaceModal />
      <LocalizationModal />
      <MyMap />
      {showBookmark && <Bookmarks />}
      {showTOC && <TOC />}
      {showIdentify && <Identify />}
      {showSimpleSearch && <SimpleSearch />}
      {showSpatialSearch && <SpatialSearch />}
      <MapInfo />
    </div>
  );
};

export default AppContainer;
