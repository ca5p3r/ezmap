import { useEffect } from "react";
import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { ZoomToExtent, FullScreen, OverviewMap, ScaleLine, defaults as defaultControls } from 'ol/control';
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
    resetMapExtent
} from "../actions";
import {
    useSelector,
    useDispatch
} from "react-redux";
import { useState } from "react";
import TOC from './toc';
import Bookmarks from './bookmarks';
import MapInfo from './widgets/info';
import MyToast from './widgets/toast';
import { transform } from "ol/proj";
const MyMap = () => {
    const dispatch = useDispatch();
    const mapInfo = useSelector(state => state.mapInfo);
    const workspaceInfo = useSelector(state => state.workspace);
    const tocOrder = useSelector(state => state.toc.comonentChanged);
    const activeLayers = useSelector(state => state.toc.activeLayers);
    const showBookmark = useSelector(state => state.bookmarks.visibility);
    const showTOC = useSelector(state => state.toc.visibility);
    const toastState = useSelector(state => state.toast);
    const transformedCenter = transform(mapInfo.mapCenter, 'EPSG:3857', 'EPSG:4326');
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
    const handleToastHide = () => {
        dispatch(triggerShowToast());
    };
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
        if (tocOrder) {
            olmap.render();
            dispatch(triggerTOCChange());
        };
        // eslint-disable-next-line
    }, [tocOrder]);
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
    return (
        <div id="map">
            {showBookmark && <Bookmarks />}
            {showTOC && <TOC />}
            <MapInfo cursorCenter={mapInfo.cursorCenter} mapCenter={transformedCenter} mapZoom={mapInfo.mapZoom} />
            <MyToast triggerShowToast={handleToastHide} color={toastState.color} visibility={toastState.visibility} title={toastState.title} message={toastState.message} />
        </div>
    );
};
export default MyMap;