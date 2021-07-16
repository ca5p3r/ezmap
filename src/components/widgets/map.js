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
    setLayers,
    disableChange,
    showToast,
    setMessage,
    setToastColor,
    resetMapExtent
} from "../../actions";
import {
    useSelector,
    useDispatch
} from "react-redux";
import { useState } from "react";
const MyMap = () => {
    const dispatch = useDispatch();
    const mapInfo = useSelector(state => state.mapInfo);
    const workspaceInfo = useSelector(state => state.workspace);
    const tocOrder = useSelector(state => state.toc.comonentChanged);
    const activeLayers = useSelector(state => state.toc.activeLayers);
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
        dispatch(setLayers(olmap.getLayers().array_));
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
            dispatch(setLayers(olmap.getLayers().array_));
            dispatch(setToastColor('success'));
            dispatch(setMessage({
                title: 'Success',
                message: 'Layer has been added!'
            }));
            dispatch(showToast());
        };
        // eslint-disable-next-line
    }, [workspaceInfo.pendingLayer]);
    useEffect(() => {
        if (tocOrder) {
            olmap.render();
            dispatch(disableChange());
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
        </div>
    );
};
export default MyMap;