const MapInfo = (props) => {
    return (
        <div id="map-info">
            <label id="xcursor">Cursor X: {props.cursorCenter[0].toFixed(2)} meter</label>
            <label id="ycursor">Cursor Y: {props.cursorCenter[1].toFixed(2)} meter</label>
            <label id="maplat">Center longitude: {props.mapCenter[0].toFixed(2)}</label>
            <label id="maplong">Center latitude: {props.mapCenter[1].toFixed(2)}</label>
            <label id="mapzoom">Map zoom: {props.mapZoom.toFixed(2)}</label>
        </div>
    );
};
export default MapInfo;