import { useEffect } from "react";
import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { setCursor, setMapCenter, setMapZoom } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

const MyMap = () => {
    const dispatch = useDispatch();
    const mapInfo = useSelector(state => state.mapInfo);
    const [olmap] = useState(new Map(
        {
            layers: [
                new TileLayer({
                    title: 'OpenStreetMap',
                    source: new OSM()
                })
            ]
        }
    ));

    useEffect(() => {
        olmap.setTarget("map");
        olmap.on('pointermove', (e) => {
            dispatch(setCursor(e.coordinate));
        });
        olmap.on('moveend', (e) => {
            dispatch(setMapZoom(e.map.getView().getZoom()));
            dispatch(setMapCenter(e.map.getView().getCenter()));
        });
    }, []);

    useEffect(() => {
        olmap.getView().setCenter(mapInfo.mapCenter);
        olmap.getView().setZoom(mapInfo.mapZoom);

    }, [mapInfo.mapZoom, mapInfo.mapCenter]);

    return (
        <div id="map">
        </div>

    );
}

export default MyMap;