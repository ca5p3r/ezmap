import TOC from "./widgets/toc";
import Bookmarks from "./widgets/bookmarks";
import MapInfo from "./containers/info";
import Identify from "./containers/identify";
import SpatialSearch from "./containers/spatialSearch";
import MyMap from "./widgets/map";
import { useSelector } from "react-redux";
import WorkspaceModal from "./modals/workspace";
import LocalizationModal from "./modals/localization";
import SimpleSearch from "./containers/simpleSearch";
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
