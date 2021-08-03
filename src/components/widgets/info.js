
import {
    useSelector
} from "react-redux";
import { transform } from "ol/proj";
const MapInfo = () => {
    const mapInfo = useSelector(state => state.mapInfo);
    const transformedCenter = transform(mapInfo.mapCenter, 'EPSG:3857', 'EPSG:4326');
    return (
        <div id="map-info">
            <label id="xcursor">Cursor X: {mapInfo.cursorCenter[0].toFixed(2)} meter</label>
            <label id="ycursor">Cursor Y: {mapInfo.cursorCenter[1].toFixed(2)} meter</label>
            <label id="maplat">Center longitude: {transformedCenter[0].toFixed(2)}</label>
            <label id="maplong">Center latitude: {transformedCenter[1].toFixed(2)}</label>
            <label id="mapzoom">Map zoom: {mapInfo.mapZoom.toFixed(2)}</label>
        </div>
    );
};
export default MapInfo;