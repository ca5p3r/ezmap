import fetch from 'node-fetch';
import { transform } from 'ol/proj.js';

const makeBuffer = (geom, point) => {
    let buffer;
    if (geom === 'Polygon' || geom === 'MultiPolygon') {
        buffer = 5
    }
    else {
        buffer = 100
    };
    const x = point[0];
    const y = point[1];
    const p1 = [x - buffer, y + buffer];
    const p2 = [x + buffer, y + buffer];
    const p3 = [x + buffer, y - buffer];
    const p4 = [x - buffer, y - buffer];
    const p5 = p1;
    return [p1, p2, p3, p4, p5]
};
export const identify = (req, res) => {
    (async () => {
        const layers = req.body.layers;
        const promises = [];
        layers.forEach(layer => {
            const buffer = makeBuffer(layer.type, req.body.clickedPoint);
            const coords = buffer.map((point) =>
                transform(point, "EPSG:3857", layer.crs).join(" ")
            );
            const queryParam = coords.join(" ");
            const raw = `<wfs:GetFeature service="WFS" outputFormat="application/json" version="1.1.0" xmlns:topp="http://www.openplans.org/topp" xmlns:wfs="http://www.opengis.net/wfs" xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Query typeName="${layer.name}"><Filter><Intersects><PropertyName>${layer.geometry}</PropertyName><gml:Polygon srsName="${layer.crs}"><gml:exterior><gml:LinearRing><gml:posList>${queryParam}</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></Intersects></Filter></wfs:Query></wfs:GetFeature>`;
            const requestOptions = {
                method: 'POST',
                body: raw,
                headers: { 'Content-Type': 'application/json' }
            };
            promises.push(fetch(layer.url + "wfs", requestOptions));
        });
        Promise.all(promises)
            .then(response => {
                let items = [];
                response.forEach(item => items.push(item.json()));
                return Promise.all(items)
            })
            .then(arr => {
                return res.send({ error: false, success: true, response: arr })
            })
            .catch(err => {
                return res.send({ error: err.message, success: false })
            })
    })
        ().catch(err => {
            return res.send({ error: err, success: false })
        });
};