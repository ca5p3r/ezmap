import { Navbar, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import LoginModal from "../modals/login";
import RegisterModal from "../modals/register";
import WorkspaceModal from "../modals/workspace";
import LocalizationModal from "../modals/localization";
import {
  triggerShowLogin,
  triggerLogin,
  triggerShowRegister,
  triggerBookmarks,
  triggerShowWorkspace,
  triggerShowTOC,
  triggerIdentify,
  setClickedPoint,
  clearResult,
  triggerIdentifyVisibility,
  setHistoricalLayers,
  triggerIsLoading,
  triggerToast,
  setUser,
  setUserID,
} from "../../actions";
import { svg } from "../assets";
const AppNavBar = () => {
  const dispatch = useDispatch();
  const userID = useSelector(state => state.login.userID);
  const visibility = useSelector(state => state.login.visibility);
  const isLogged = useSelector(state => state.login.isLogged);
  const showRegister = useSelector(state => state.register.visibility);
  const showBookmarks = useSelector(state => state.bookmarks.visibility);
  const bookmarks = useSelector(state => state.bookmarks.list);
  const mapCenter = useSelector(state => state.mapInfo.mapCenter);
  const mapZoom = useSelector(state => state.mapInfo.mapZoom);
  const data = useSelector(state => state.toc.historicalData);
  const showTOC = useSelector(state => state.toc.visibility);
  const workspaceVisibility = useSelector(state => state.workspace.visibility);
  const identifyState = useSelector(state => state.identify.enabled);
  const handleLogout = () => {
    dispatch(setHistoricalLayers());
    dispatch(triggerLogin());
    dispatch(triggerBookmarks());
    dispatch(triggerShowWorkspace());
    dispatch(triggerShowTOC());
    dispatch(setUser());
    dispatch(setUserID());
    dispatch(triggerIdentifyVisibility());
    dispatch(triggerIdentify());
  };
  const handleBookmarkClick = () => {
    dispatch(triggerBookmarks(!showBookmarks));
    dispatch(triggerShowWorkspace());
    dispatch(triggerShowTOC());
    dispatch(triggerIdentifyVisibility());
  };
  const handleWorkspaceClick = () => {
    dispatch(triggerShowWorkspace(!workspaceVisibility));
    dispatch(triggerBookmarks());
    dispatch(triggerShowTOC());
    dispatch(triggerIdentifyVisibility());
  };
  const handleTOCClick = () => {
    dispatch(triggerShowTOC(!showTOC));
    dispatch(triggerBookmarks());
    dispatch(triggerShowWorkspace());
    dispatch(triggerIdentifyVisibility());
  };
  const handleIdentifyClick = () => {
    dispatch(triggerIdentify(!identifyState));
    dispatch(triggerBookmarks());
    dispatch(triggerShowTOC());
    dispatch(triggerIdentifyVisibility());
    dispatch(setClickedPoint([]));
    dispatch(clearResult());
  };
  const handleSave = () => {
    dispatch(triggerIsLoading(true));
    const obj = {
      bookmarks: bookmarks,
      map: {
        center: mapCenter,
        zoom: mapZoom,
        extent: [2099724.35, 2504130.79, 4659273.23, 3724669.16],
        layers: data.historicalData,
      },
    };
    const body = {
      id: userID,
      obj,
    };
    fetch("http://localhost:9000/config/saveSettings", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((obj) => {
        dispatch(triggerIsLoading());
        dispatch(
          triggerToast({
            title: "Success",
            message: "Settings have been saved!",
            visible: true,
          })
        );
      })
      .catch((err) => {
        dispatch(triggerIsLoading());
        dispatch(
          triggerToast({
            title: "Danger",
            message: err.toString(),
            visible: true,
          })
        );
      });
  };
  return (
    <Navbar bg="info" expand="lg">
      <Navbar.Brand>{svg.logo} EasyMap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="menavbar-nav ml-auto">
          {isLogged && (
            <>
              <Nav.Link onClick={handleSave} title="Save">
                {svg.save}
              </Nav.Link>
              <Nav.Link title="Routing">{svg.routing}</Nav.Link>
              <Nav.Link title="Export file">{svg.export}</Nav.Link>
              <Nav.Link title="Import file">{svg.import}</Nav.Link>
              <Nav.Link title="Sketching">{svg.sketching}</Nav.Link>
              <Nav.Link title="Editing">{svg.editing}</Nav.Link>
              <Nav.Link title="Spatial search">{svg.spatialSearch}</Nav.Link>
              <Nav.Link title="Tabular search">{svg.tabularSearch}</Nav.Link>
              <Nav.Link title="Simple search">{svg.simpleSearch}</Nav.Link>
              <Nav.Link onClick={handleIdentifyClick} title="Identify">
                {svg.identify}
              </Nav.Link>
              <Nav.Link onClick={handleBookmarkClick} title="Bookmarks">
                {svg.bookmarks}
              </Nav.Link>
              <Nav.Link onClick={handleWorkspaceClick} title="Layer manager">
                {svg.layerManager}
              </Nav.Link>
              <Nav.Link onClick={handleTOCClick} title="Table of contents">
                {svg.toc}
              </Nav.Link>
              <Nav.Link onClick={handleLogout} title="Logout">
                {svg.logout}
              </Nav.Link>
            </>
          )}
          {!isLogged && (
            <Nav.Link
              onClick={() => dispatch(triggerShowRegister(!showRegister))}
              title="Register"
            >
              {svg.register}
            </Nav.Link>
          )}
          {!isLogged && (
            <Nav.Link
              onClick={() => dispatch(triggerShowLogin(!visibility))}
              title="Login"
            >
              {svg.login}
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
      <LoginModal />
      <RegisterModal />
      <WorkspaceModal />
      <LocalizationModal />
    </Navbar>
  );
};
export default AppNavBar;
