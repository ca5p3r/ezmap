import { Navbar, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
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
	triggerSpatialSearchVisibility,
	setHistoricalLayers,
	triggerIsLoading,
	triggerToast,
	setUser,
	setUserID,
	triggerSimpleSearch,
	triggerSpatialSearch,
	setDrawnPolygon,
	clearSpatialResult
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
	const spatialSearchState = useSelector(state => state.spatialSearch.enabled);
	const showSimpleSearch = useSelector(state => state.simpleSearch.visibility);
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
		dispatch(triggerSimpleSearch());
		dispatch(triggerSpatialSearch());
	};
	const handleBookmarkClick = () => {
		dispatch(triggerBookmarks(!showBookmarks));
		dispatch(triggerShowWorkspace());
		dispatch(triggerShowTOC());
		dispatch(triggerIdentifyVisibility());
		dispatch(triggerSimpleSearch());
		dispatch(triggerSpatialSearch());
	};
	const handleWorkspaceClick = () => {
		dispatch(triggerShowWorkspace(!workspaceVisibility));
		dispatch(triggerBookmarks());
		dispatch(triggerShowTOC());
		dispatch(triggerIdentifyVisibility());
		dispatch(triggerSimpleSearch());
		dispatch(triggerSpatialSearch());
	};
	const handleTOCClick = () => {
		dispatch(triggerShowTOC(!showTOC));
		dispatch(triggerBookmarks());
		dispatch(triggerShowWorkspace());
		dispatch(triggerIdentifyVisibility());
		dispatch(triggerSimpleSearch());
		dispatch(triggerSpatialSearch());
	};
	const handleIdentifyClick = () => {
		dispatch(triggerIdentify(!identifyState));
		dispatch(triggerBookmarks());
		dispatch(triggerShowTOC());
		dispatch(triggerIdentifyVisibility());
		dispatch(setClickedPoint([]));
		dispatch(clearResult());
		dispatch(triggerSimpleSearch());
		dispatch(triggerSpatialSearch());
	};
	const handleSpatialSearchClick = () => {
		dispatch(triggerSpatialSearch(!spatialSearchState));
		dispatch(triggerIdentify());
		dispatch(triggerBookmarks());
		dispatch(triggerShowTOC());
		dispatch(triggerSpatialSearchVisibility());
		dispatch(setDrawnPolygon([]));
		dispatch(clearSpatialResult());
		dispatch(triggerSimpleSearch());
	};
	const handleSimpleSearchClick = () => {
		dispatch(triggerSimpleSearch(!showSimpleSearch));
		dispatch(triggerIdentify());
		dispatch(triggerBookmarks());
		dispatch(triggerShowTOC());
		dispatch(triggerIdentifyVisibility());
		dispatch(triggerSpatialSearch());
	};
	const handleJSONReponse = obj => {
		if (obj.success) {
			dispatch(
				triggerToast({
					title: "Success",
					message: "Settings have been saved!",
					visible: true,
				})
			);
		} else {
			dispatch(
				triggerToast({
					title: "Danger",
					message: obj.error,
					visible: true,
				})
			);
		}
		dispatch(triggerIsLoading());
	};
	const handleError = err => {
		dispatch(
			triggerToast({
				title: "Danger",
				message: err.toString(),
				visible: true,
			})
		);
		dispatch(triggerIsLoading());
	};
	const handleSave = () => {
		dispatch(triggerIsLoading(true));
		const settingsObject = {
			bookmarks: bookmarks,
			map: {
				center: mapCenter,
				zoom: mapZoom,
				extent: [2099724.35, 2504130.79, 4659273.23, 3724669.16],
				layers: data,
			},
		};
		const body = {
			id: userID,
			obj: settingsObject,
		};
		fetch("http://localhost:9090/configService/saveSettings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		})
			.then(response => response.json())
			.then(obj => handleJSONReponse(obj))
			.catch(err => handleError(err))
	};
	return (
		<Navbar bg="light" expand="lg" className="navbar">
			<Navbar.Brand>{svg.logo} EasyMap</Navbar.Brand>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav className="me-auto"></Nav>
				<Nav className="menavbar-nav ml-auto">
					{isLogged && (
						<>
							<Nav.Link onClick={handleSave} title="Save">
								{svg.save}
							</Nav.Link>
							<Nav.Link title="Routing">{svg.routing}</Nav.Link>
							<Nav.Link title="Export file">{svg.export}</Nav.Link>
							<Nav.Link title="Import file">{svg.import}</Nav.Link>
							<Nav.Link title="Sketching">{svg.sketch}</Nav.Link>
							<Nav.Link title="Measurements">{svg.measure}</Nav.Link>
							<Nav.Link title="Editing">{svg.editing}</Nav.Link>
							<Nav.Link title="Tabular search">{svg.tabularSearch}</Nav.Link>
							<Nav.Link onClick={handleSpatialSearchClick} title="Spatial search">
								{svg.spatialSearch}
							</Nav.Link>
							<Nav.Link onClick={handleSimpleSearchClick} title="Simple search">
								{svg.simpleSearch}
							</Nav.Link>
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
		</Navbar>
	);
};
export default AppNavBar;
