import { useEffect } from "react";
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { setCursor, setMapCenter, setMapZoom } from "../../actions";
import { useSelector, useDispatch } from "react-redux";

const MyMap = () => {
    const dispatch = useDispatch();
    const mapInfo = useSelector(state => state.mapInfo);

    const olmap = new Map(
        {
            target: null,
            layers: [
                new TileLayer({
                    title: 'OpenStreetMap',
                    source: new OSM()
                })
            ],
            view: new View({
                center: mapInfo.mapCenter,
                zoom: mapInfo.mapZoom
            })
        }
    );

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

    return (
        <div id="map">
        </div>

    );
}

export default MyMap;