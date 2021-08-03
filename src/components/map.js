import {
    useEffect,
    useState
} from "react";
import { Map } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import {
    ZoomToExtent,
    FullScreen,
    OverviewMap,
    ScaleLine,
    defaults as defaultControls
} from 'ol/control';
import { transform } from "ol/proj";
import 'ol/ol.css';
import { Draw } from 'ol/interaction';
import {
    setCursor,
    setMapCenter,
    setMapZoom,
    resetPendingLayer,
    setActiveLayers,
    triggerTOCChange,
    triggerToast,
    triggerShowTOC,
    resetMapExtent,
    setMapExtent,
    setClickedPoint,
    clearResult,
    setResult,
    triggerIdentifyVisibility,
    setHistoricalLayer
} from "../actions";
import {
    useSelector,
    useDispatch
} from "react-redux";
import { makeBuffer } from '../utils';
import TOC from './widgets/toc';
import Bookmarks from './widgets/bookmarks';
import MapInfo from './widgets/info';
import Identify from "./widgets/identify";
const MyMap = () => {
    const dispatch = useDispatch();
    const mapInfo = useSelector(state => state.mapInfo);
    const showBookmark = useSelector(state => state.bookmarks.visibility);
    const workspaceInfo = useSelector(state => state.workspace);
    const tocInfo = useSelector(state => state.toc);
    const showIdentify = useSelector(state => state.identify.visibility);
    const identifyState = useSelector(state => state.identify.enabled);
    const activeLayers = tocInfo.activeLayers;
    const showTOC = tocInfo.visibility;
    const transformedCenter = transform(mapInfo.mapCenter, 'EPSG:3857', 'EPSG:4326');
    const trigger = tocInfo.comonentChanged;
    const data = tocInfo.historicalData;
    const draw = new Draw({
        type: 'Point'
    });
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
        olmap.on('click', (e) => {
            dispatch(setClickedPoint(e.coordinate))
        });
        olmap.addLayer(new TileLayer({
            title: 'OpenStreetMap',
            source: new OSM()
        }));
        dispatch(setActiveLayers(olmap.getLayers().array_));
        olmap.getTargetElement().style.cursor = 'circle';
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
            dispatch(triggerToast({
                title: 'Success',
                message: 'Layer has been added!',
                visible: true
            }));
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
    useEffect(() => {
        if (identifyState) {
            dispatch(triggerToast({
                title: 'Info',
                message: 'Select a feature on the map!',
                visible: true
            }));
            olmap.addInteraction(draw);
        }
        else {
            olmap.getInteractions().forEach((interaction) => {
                if (interaction instanceof Draw) {
                    olmap.removeInteraction(interaction);
                };
            });
        }
        // eslint-disable-next-line
    }, [identifyState]);
    useEffect(() => {
        if (identifyState) {
            if (mapInfo.clickedPoint.length > 0) {
                dispatch(clearResult());
                const controller = new AbortController();
                const buffer = makeBuffer(mapInfo.clickedPoint);
                const queriableLayers = data.filter(item => item.geometry !== null);
                if (queriableLayers.length > 0) {
                    queriableLayers.forEach(layer => {
                        const coords = [transform(buffer.p1, 'EPSG:3857', layer.crs).join(' '), transform(buffer.p2, 'EPSG:3857', layer.crs).join(' '), transform(buffer.p3, 'EPSG:3857', layer.crs).join(' '), transform(buffer.p4, 'EPSG:3857', layer.crs).join(' '), transform(buffer.p5, 'EPSG:3857', layer.crs).join(' ')];
                        const queryParam = coords.join(' ');
                        let raw = `<wfs:GetFeature service="WFS" outputFormat="application/json" version="1.1.0" xmlns:topp="http://www.openplans.org/topp" xmlns:wfs="http://www.opengis.net/wfs" xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Query typeName="${layer.name}"><Filter><Intersects><PropertyName>${layer.geometry}</PropertyName><gml:Polygon srsName="${layer.crs}"><gml:exterior><gml:LinearRing><gml:posList>${queryParam}</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></Intersects></Filter></wfs:Query></wfs:GetFeature>`;
                        let requestOptions = {
                            method: 'POST',
                            body: raw,
                            mode: 'cors',
                        };
                        fetch(layer.url + 'wfs', requestOptions)
                            .then(res => {
                                if (!res.ok) {
                                    dispatch(triggerToast({
                                        title: 'Danger',
                                        message: 'Could not fetch data!',
                                        visible: true
                                    }));
                                };
                                return res.json();
                            })
                            .then(obj => {
                                if (obj.features[0]) {
                                    dispatch(setResult(obj.features[0]));
                                    dispatch(triggerIdentifyVisibility(true));
                                }
                                else {
                                    dispatch(triggerToast({
                                        title: 'Warning',
                                        message: `No results found for layer ${layer.title}!`,
                                        visible: true
                                    }));
                                }
                            })
                            .catch(error => {
                                if (error.name !== 'AbortError') {
                                    dispatch(triggerToast({
                                        title: 'Danger',
                                        message: error.toString(),
                                        visible: true
                                    }));
                                };
                            });
                    })
                }
                else {
                    dispatch(triggerToast({
                        title: 'Warning',
                        message: 'No queriable layers found!',
                        visible: true
                    }));
                }
                return () => {
                    controller.abort()
                };
            };
        }
        // eslint-disable-next-line
    }, [mapInfo.clickedPoint, identifyState]);
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
        let tocRemainingLayers = data.filter(item => item.id !== title.split('&')[1]);
        dispatch(setActiveLayers(remainingLayers));
        dispatch(setHistoricalLayer(tocRemainingLayers));
    };
    const handleGoToLayer = (title) => {
        let uniqueID = title.split('&')[1];
        let newExtent = (data.filter(item => item.id === uniqueID))[0].extent;
        dispatch(setMapExtent(newExtent));
    };
    return (
        <div id="map">
            {showBookmark && <Bookmarks />}
            {showTOC && <TOC trigger={trigger} activeLayers={activeLayers} handleOnDragEnd={handleOnDragEnd} handleDismiss={handleTOCDismiss} handleVisibility={handleLayerVisibility} handleRemove={handleLayerRemove} handleGoTo={handleGoToLayer} />}
            {showIdentify && <Identify />}
            <MapInfo cursorCenter={mapInfo.cursorCenter} mapCenter={transformedCenter} mapZoom={mapInfo.mapZoom} />
        </div>
    );
};
export default MyMap;