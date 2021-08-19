
import {
    useSelector
} from "react-redux";
import { transform } from "ol/proj";
const MapInfo = () => {
    const cursorCenter = useSelector(state => state.mapInfo.cursorCenter);
    const mapCenter = useSelector(state => state.mapInfo.mapCenter);
    const mapZoom = useSelector(state => state.mapInfo.mapZoom);
    const transformedCenter = transform(mapCenter, 'EPSG:3857', 'EPSG:4326');
    return (
        <div id="map-info">
            <label id="xcursor">Cursor X: {cursorCenter[0].toFixed(2)} meter</label>
            <label id="ycursor">Cursor Y: {cursorCenter[1].toFixed(2)} meter</label>
            <label id="maplat">Center longitude: {transformedCenter[0].toFixed(2)}</label>
            <label id="maplong">Center latitude: {transformedCenter[1].toFixed(2)}</label>
            <label id="mapzoom">Map zoom: {mapZoom.toFixed(2)}</label>
        </div>
    );
};
export default MapInfo;