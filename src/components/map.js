import {
    useEffect,
    useState
} from "react";
import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {
    ZoomToExtent,
    FullScreen,
    OverviewMap,
    ScaleLine,
    defaults as defaultControls
} from 'ol/control';
import { transform } from "ol/proj";
import 'ol/ol.css';
import {
    setCursor,
    setMapCenter,
    setMapZoom,
    resetPendingLayer,
    setActiveLayers,
    triggerTOCChange,
    triggerShowToast,
    setMessage,
    setToastColor,
    triggerShowTOC,
    resetMapExtent,
    setMapExtent,
    triggerBookmarks,
    addBookmark,
    removeAllBookmarks,
    removeBookmark
} from "../actions";
import {
    useSelector,
    useDispatch
} from "react-redux";
import TOC from './widgets/toc';
import Bookmarks from './widgets/bookmarks';
import MapInfo from './widgets/info';
import MyToast from './widgets/toast';
const MyMap = () => {
    const dispatch = useDispatch();
    const mapInfo = useSelector(state => state.mapInfo);
    const bookmarksInfo = useSelector(state => state.bookmarks);
    const workspaceInfo = useSelector(state => state.workspace);
    const tocInfo = useSelector(state => state.toc);
    const toastInfo = useSelector(state => state.toast);
    const activeLayers = tocInfo.activeLayers;
    const showBookmark = bookmarksInfo.visibility;
    const showTOC = tocInfo.visibility;
    const transformedCenter = transform(mapInfo.mapCenter, 'EPSG:3857', 'EPSG:4326');
    const trigger = tocInfo.comonentChanged;
    const data = tocInfo.historicalData;
    const bookmarksList = bookmarksInfo.list;
    const [olmap] = useState(new Map({
        controls: defaultControls().extend([
            new ZoomToExtent({
                extent: mapInfo.defaultExtent,
            }),
            new FullScreen(),
            new OverviewMap({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
            }),
            new ScaleLine({
                units: 'metric',
            }),
        ])
    }));
    useEffect(() => {
        olmap.setTarget("map");
        olmap.on('pointermove', (e) => {
            dispatch(setCursor(e.coordinate));
        });
        olmap.on('moveend', (e) => {
            dispatch(setMapZoom(e.map.getView().getZoom()));
            dispatch(setMapCenter(e.map.getView().getCenter()));
        });
        olmap.addLayer(new TileLayer({
            title: 'OpenStreetMap',
            source: new OSM()
        }));
        dispatch(setActiveLayers(olmap.getLayers().array_));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        olmap.getView().setCenter(mapInfo.mapCenter);
        olmap.getView().setZoom(mapInfo.mapZoom);
        // eslint-disable-next-line
    }, [mapInfo.mapZoom, mapInfo.mapCenter]);
    useEffect(() => {
        if (Object.keys(workspaceInfo.pendingLayer).length > 0) {
            olmap.addLayer(workspaceInfo.pendingLayer);
            dispatch(resetPendingLayer());
            dispatch(setActiveLayers(olmap.getLayers().array_));
            dispatch(setToastColor('success'));
            dispatch(setMessage({
                title: 'Success',
                message: 'Layer has been added!'
            }));
            dispatch(triggerShowToast(true));
        };
        // eslint-disable-next-line
    }, [workspaceInfo.pendingLayer]);
    useEffect(() => {
        if (tocInfo.comonentChanged) {
            olmap.render();
            dispatch(triggerTOCChange());
        };
        // eslint-disable-next-line
    }, [tocInfo.comonentChanged]);
    useEffect(() => {
        if (activeLayers) {
            olmap.getLayers().array_ = activeLayers;
            olmap.render();
        }
        // eslint-disable-next-line
    }, [activeLayers]);
    useEffect(() => {
        if (mapInfo.mapExtent.length > 0) {
            olmap.getView().fit(mapInfo.mapExtent);
            dispatch(resetMapExtent());
        }
        // eslint-disable-next-line
    }, [mapInfo.mapExtent.length]);
    const handleBookmarkDismiss = () => {
        dispatch(triggerBookmarks());
    };
    const handleBookmarkSave = (title) => {
        if (title) {
            const myObj = {
                center: mapInfo.mapCenter,
                zoom: mapInfo.mapZoom,
                title
            };
            dispatch(addBookmark(myObj));
            dispatch(setToastColor('success'));
            dispatch(setMessage({
                title: 'Success',
                message: 'Bookmark saved!'
            }));
            dispatch(triggerShowToast(true));
        }
        else {
            dispatch(setToastColor('warning'));
            dispatch(setMessage({
                title: 'Warning',
                message: 'Please enter bookmark title!'
            }));
            dispatch(triggerShowToast(true));
        };
    };
    const handleRemoveAllBookmarks = () => {
        dispatch(removeAllBookmarks());
        dispatch(setToastColor('info'));
        dispatch(setMessage({
            title: 'Notice',
            message: 'All bookmarks are deleted!'
        }));
        dispatch(triggerShowToast(true));
    };
    const handleRemoveBookmark = () => {
        let item = document.getElementById('formBasicDropdown').value;
        if (item && item !== 'Selector') {
            dispatch(removeBookmark(item));
            dispatch(setToastColor('info'));
            dispatch(setMessage({
                title: 'Notice',
                message: 'Bookmark is deleted!'
            }));
            dispatch(triggerShowToast(true));
        }
        else {
            dispatch(setToastColor('warning'));
            dispatch(setMessage({
                title: 'Warning',
                message: 'Please select a bookmark first!'
            }));
            dispatch(triggerShowToast(true));
        };
    };
    const handleLoadBookmark = () => {
        let selectedBookmark = document.getElementById('formBasicDropdown').value;
        let selectedElement = document.getElementById(`option${selectedBookmark}`);
        let centerx = Number(selectedElement.getAttribute('center').split(',')[0]);
        let centery = Number(selectedElement.getAttribute('center').split(',')[1]);
        let zoom = Number(selectedElement.getAttribute('zoom'));
        dispatch(setMapZoom(zoom));
        dispatch(setMapCenter([centerx, centery]));
    };
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const [reorderedItem] = activeLayers.splice(result.source.index, 1);
        activeLayers.splice(result.destination.index, 0, reorderedItem);
        dispatch(setActiveLayers(activeLayers));
        dispatch(triggerTOCChange(true));
    };
    const handleTOCDismiss = () => {
        dispatch(triggerShowTOC());
    };
    const handleLayerVisibility = (title) => {
        activeLayers.forEach(layer => {
            if (layer.values_.title === title) {
                layer.values_.visible = !layer.values_.visible
            }
        });
        dispatch(setActiveLayers(activeLayers));
        dispatch(triggerTOCChange(true));
    };
    const handleLayerRemove = (title) => {
        let remainingLayers = activeLayers.filter(layer => layer.values_.title !== title);
        dispatch(setActiveLayers(remainingLayers));
    };
    const handleGoToLayer = (title) => {
        let uniqueID = title.split('&')[1];
        let newExtent = (data.filter(item => item.id === uniqueID))[0].extent;
        dispatch(setMapExtent(newExtent));
    };
    const handleToastTrigger = () => {
        dispatch(triggerShowToast());
    };
    return (
        <div id="map">
            {showBookmark && <Bookmarks bookmarksList={bookmarksList} handleDismiss={handleBookmarkDismiss} handleSave={handleBookmarkSave} handleRemoveAll={handleRemoveAllBookmarks} handleRemove={handleRemoveBookmark} handleLoad={handleLoadBookmark} />}
            {showTOC && <TOC trigger={trigger} activeLayers={activeLayers} handleOnDragEnd={handleOnDragEnd} handleDismiss={handleTOCDismiss} handleVisibility={handleLayerVisibility} handleRemove={handleLayerRemove} handleGoTo={handleGoToLayer} />}
            <MapInfo cursorCenter={mapInfo.cursorCenter} mapCenter={transformedCenter} mapZoom={mapInfo.mapZoom} />
            <MyToast triggerShowToast={handleToastTrigger} color={toastInfo.color} visibility={toastInfo.visibility} title={toastInfo.title} message={toastInfo.message} />
        </div>
    );
};
export default MyMap;