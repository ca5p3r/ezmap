import {
    Navbar,
    Nav
} from "react-bootstrap";
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { useState } from 'react';
import LoginModal from "./widgets/login";
import WorkspaceModal from "./widgets/workspace";
import {
    triggerShowLogin,
    triggerLogin,
    triggerBookmarks,
    triggerShowWorkspace,
    triggerShowTOC,
    updateLayers,
    resetLayers,
    addPendingLayer,
    triggerShowToast,
    setMessage,
    setToastColor,
    insertHistoricalLayer,
    triggerIdentify
} from '../actions';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import ImageWMS from 'ol/source/ImageWMS';
import Image from 'ol/layer/Image';
import { transform } from "ol/proj";
import { v4 as uuidv4 } from 'uuid';
const AppNavBar = () => {
    const dispatch = useDispatch();
    const [availability, setAvailability] = useState(false);
    const loginInfo = useSelector(state => state.login);
    const bookmarkInfo = useSelector(state => state.bookmarks);
    const TOCInfo = useSelector(state => state.toc);
    const workspaceInfo = useSelector(state => state.workspace);
    const identifyInfo = useSelector(state => state.identify);
    const TOCState = TOCInfo.visibility;
    const bookmarkState = bookmarkInfo.visibility;
    const workspaceVisibility = workspaceInfo.visibility;
    const isLogged = loginInfo.isLogged;
    const showLogin = loginInfo.visibility;
    const identifyState = identifyInfo.enabled;
    const handleHide = () => {
        dispatch(triggerShowWorkspace());
    };
    const handleFetch = (url) => {
        const parser = new WMSCapabilities();
        if (url && url !== '') {
            fetch(`${url}?request=getCapabilities`)
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    const result = parser.read(text);
                    return result.Capability.Layer.Layer;
                })
                .then((arr) => {
                    dispatch(updateLayers(arr));
                    setAvailability(true);
                })
                .catch((err) => {
                    dispatch(setToastColor('danger'));
                    dispatch(setMessage({
                        title: 'Fetch error',
                        message: err.toString()
                    }));
                    dispatch(triggerShowToast(true));
                    dispatch(resetLayers());
                    setAvailability(false);
                });
        }
        else {
            dispatch(setToastColor('warning'));
            dispatch(setMessage({
                title: 'Warning',
                message: 'Please enter URL!'
            }));
            dispatch(triggerShowToast(true));
        };

    };
    const handleAdd = (url) => {
        if (availability) {
            let geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection'];
            let layerName = document.getElementById('formBasicLayer').value;
            let selectedElement = document.getElementById(`option${layerName}`);
            let layerTitle = selectedElement.getAttribute('title');
            let crs = selectedElement.getAttribute('crs');
            let uniqueID = uuidv4();
            let extentGeographic = selectedElement.getAttribute('extent');
            let p1 = transform(extentGeographic.split(',').slice(0, 2), 'EPSG:4326', 'EPSG:3857');
            let p2 = transform(extentGeographic.split(',').slice(2), 'EPSG:4326', 'EPSG:3857');
            if (layerName && layerName !== 'Selector') {
                fetch(`${url.slice(0, -3)}wfs?request=DescribeFeatureType&outputFormat=application/json&typeName=${layerName}`)
                    .then((response) => {
                        return response.text();
                    })
                    .then((text) => {
                        let obj = JSON.parse(text);
                        return obj;
                    })
                    .then((obj) => {
                        let fields = obj.featureTypes[0].properties
                        var geomField = fields.filter(field => geometries.includes(field.localType));
                        dispatch(insertHistoricalLayer({
                            id: uniqueID,
                            extent: [...p1, ...p2],
                            type: geomField[0].localType,
                            geometry: geomField[0].name,
                            crs
                        }));
                    })
                    .catch(() => {
                        dispatch(insertHistoricalLayer({
                            id: uniqueID,
                            extent: [...p1, ...p2],
                            type: null,
                            geometry: null,
                            crs
                        }));
                    });
                const obj = new Image(
                    {
                        title: `${layerTitle}&${uniqueID}`,
                        source: new ImageWMS(
                            {
                                url: url,
                                params: {
                                    LAYERS: [layerName],
                                    VERSION: '1.1.1'
                                }
                            }
                        )
                    }
                );
                dispatch(addPendingLayer(obj));
            }
            else {
                dispatch(setToastColor('warning'));
                dispatch(setMessage({
                    title: 'Warning',
                    message: 'Please select a layer!'
                }));
                dispatch(triggerShowToast(true));
            };
        }
        else {
            dispatch(setToastColor('warning'));
            dispatch(setMessage({
                title: 'Warning',
                message: 'Please enter URL!'
            }));
            dispatch(triggerShowToast(true));
        };
    };
    const handleTriggerShowLogin = () => {
        dispatch(triggerShowLogin(!showLogin));
    };
    const handleLogin = () => {
        dispatch(triggerLogin(true));
        dispatch(triggerShowLogin());
    };
    const handleLogout = () => {
        dispatch(triggerLogin());
        dispatch(triggerBookmarks());
        dispatch(triggerShowWorkspace());
        dispatch(triggerShowTOC());
    };
    const handleBookmarkClick = () => {
        dispatch(triggerBookmarks(!bookmarkState));
        dispatch(triggerShowWorkspace());
        dispatch(triggerShowTOC());
    };
    const handleWorkspaceClick = () => {
        dispatch(triggerShowWorkspace(!workspaceVisibility));
        dispatch(triggerBookmarks());
        dispatch(triggerShowTOC());
    };
    const handleTOCClick = () => {
        dispatch(triggerShowTOC(!TOCState));
        dispatch(triggerBookmarks());
        dispatch(triggerShowWorkspace());
    };
    const handleIdentifyClick = () => {
        dispatch(triggerIdentify(!identifyState));
    }
    return (
        <Navbar bg="info" expand="lg">
            <Navbar.Brand><svg width="30" height="29" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" className="svg-inline--fa fa-map-marker-alt fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg> EasyMap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="menavbar-nav ml-auto">
                    {isLogged && <>
                        <Nav.Link title="Routing"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="route" className="svg-inline--fa fa-route fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 320h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96s96-107 96-160-43-96-96-96-96 43-96 96c0 25.5 22.2 63.4 45.3 96H320c-52.9 0-96 43.1-96 96s43.1 96 96 96h96c17.6 0 32 14.4 32 32s-14.4 32-32 32H185.5c-16 24.8-33.8 47.7-47.3 64H416c52.9 0 96-43.1 96-96s-43.1-96-96-96zm0-256c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zM96 256c-53 0-96 43-96 96s96 160 96 160 96-107 96-160-43-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path></svg></Nav.Link>
                        <Nav.Link title="Export file"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-import" className="svg-inline--fa fa-file-import fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M16 288c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h112v-64zm489-183L407.1 7c-4.5-4.5-10.6-7-17-7H384v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H152c-13.3 0-24 10.7-24 24v264h128v-65.2c0-14.3 17.3-21.4 27.4-11.3L379 308c6.6 6.7 6.6 17.4 0 24l-95.7 96.4c-10.1 10.1-27.4 3-27.4-11.3V352H128v136c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H376c-13.2 0-24-10.8-24-24z"></path></svg></Nav.Link>
                        <Nav.Link title="Import file"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-export" className="svg-inline--fa fa-file-export fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M384 121.9c0-6.3-2.5-12.4-7-16.9L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128zM571 308l-95.7-96.4c-10.1-10.1-27.4-3-27.4 11.3V288h-64v64h64v65.2c0 14.3 17.3 21.4 27.4 11.3L571 332c6.6-6.6 6.6-17.4 0-24zm-379 28v-32c0-8.8 7.2-16 16-16h176V160H248c-13.2 0-24-10.8-24-24V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V352H208c-8.8 0-16-7.2-16-16z"></path></svg></Nav.Link>
                        <Nav.Link title="Sketching"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pencil-ruler" className="svg-inline--fa fa-pencil-ruler fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M109.46 244.04l134.58-134.56-44.12-44.12-61.68 61.68a7.919 7.919 0 0 1-11.21 0l-11.21-11.21c-3.1-3.1-3.1-8.12 0-11.21l61.68-61.68-33.64-33.65C131.47-3.1 111.39-3.1 99 9.29L9.29 99c-12.38 12.39-12.39 32.47 0 44.86l100.17 100.18zm388.47-116.8c18.76-18.76 18.75-49.17 0-67.93l-45.25-45.25c-18.76-18.76-49.18-18.76-67.95 0l-46.02 46.01 113.2 113.2 46.02-46.03zM316.08 82.71l-297 296.96L.32 487.11c-2.53 14.49 10.09 27.11 24.59 24.56l107.45-18.84L429.28 195.9 316.08 82.71zm186.63 285.43l-33.64-33.64-61.68 61.68c-3.1 3.1-8.12 3.1-11.21 0l-11.21-11.21c-3.09-3.1-3.09-8.12 0-11.21l61.68-61.68-44.14-44.14L267.93 402.5l100.21 100.2c12.39 12.39 32.47 12.39 44.86 0l89.71-89.7c12.39-12.39 12.39-32.47 0-44.86z"></path></svg></Nav.Link>
                        <Nav.Link title="Editing"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" className="svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg></Nav.Link>
                        <Nav.Link title="Spatial search"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marked" className="svg-inline--fa fa-map-marked fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z"></path></svg></Nav.Link>
                        <Nav.Link title="Tabular search"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="table" className="svg-inline--fa fa-table fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64v-96h160v96zm0-160H64v-96h160v96zm224 160H288v-96h160v96zm0-160H288v-96h160v96z"></path></svg></Nav.Link>
                        <Nav.Link title="Simple search"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" className="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg></Nav.Link>
                        <Nav.Link onClick={handleIdentifyClick} title="Identify"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" className="svg-inline--fa fa-info-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg></Nav.Link>
                        <Nav.Link onClick={handleBookmarkClick} title="Bookmarks"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bookmark" className="svg-inline--fa fa-bookmark fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"></path></svg></Nav.Link>
                        <Nav.Link onClick={handleWorkspaceClick} title="Layer manager"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tools" className="svg-inline--fa fa-tools fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z"></path></svg></Nav.Link>
                        <Nav.Link onClick={handleTOCClick} title="Table of contents"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="far" data-icon="list-alt" className="svg-inline--fa fa-list-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm-6 400H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v340a6 6 0 0 1-6 6zm-42-92v24c0 6.627-5.373 12-12 12H204c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h200c6.627 0 12 5.373 12 12zm0-96v24c0 6.627-5.373 12-12 12H204c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h200c6.627 0 12 5.373 12 12zm0-96v24c0 6.627-5.373 12-12 12H204c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h200c6.627 0 12 5.373 12 12zm-252 12c0 19.882-16.118 36-36 36s-36-16.118-36-36 16.118-36 36-36 36 16.118 36 36zm0 96c0 19.882-16.118 36-36 36s-36-16.118-36-36 16.118-36 36-36 36 16.118 36 36zm0 96c0 19.882-16.118 36-36 36s-36-16.118-36-36 16.118-36 36-36 36 16.118 36 36z"></path></svg></Nav.Link>
                        <Nav.Link onClick={handleLogout} title="Logout"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sign-out-alt" className="svg-inline--fa fa-sign-out-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path></svg></Nav.Link></>}
                    {!isLogged && <Nav.Link onClick={handleTriggerShowLogin} title="Login"><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sign-in-alt" className="svg-inline--fa fa-sign-in-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"></path></svg></Nav.Link>}
                </Nav>
            </Navbar.Collapse>
            {showLogin && <LoginModal showLogin={showLogin} handleLogin={handleLogin} handleHide={handleTriggerShowLogin} />}
            {workspaceVisibility && <WorkspaceModal visibility={workspaceVisibility} availability={availability} handleHide={handleHide} handleFetch={handleFetch} handleAdd={handleAdd} layers={workspaceInfo.layers} />}
        </Navbar>
    );
};
export default AppNavBar;