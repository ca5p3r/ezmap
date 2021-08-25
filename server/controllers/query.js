import fetch from 'node-fetch';
import { makeBuffer, convert } from '../helpers/index.js';

export const query = (req, res) => {
    switch (req.body.type) {
        case 'identify':
            const layers = req.body.layers;
            const promises = [];
            layers.forEach(layer => {
                const buffer = makeBuffer(layer.type, req.body.clickedPoint);
                const coords = buffer.map((point) =>
                    convert("EPSG:3857", layer.crs, point).join(" ")
                );
                const queryParam = coords.join(" ");
                const raw = `<wfs:GetFeature service="WFS" outputFormat="application/json" version="1.1.0" xmlns:topp="http://www.openplans.org/topp" xmlns:wfs="http://www.opengis.net/wfs" xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Query typeName="${layer.name}"><Filter><Intersects><PropertyName>${layer.geometry}</PropertyName><gml:Polygon srsName="${layer.crs}"><gml:exterior><gml:LinearRing><gml:posList>${queryParam}</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></Intersects></Filter></wfs:Query></wfs:GetFeature>`;
                const requestOptions = {
                    method: 'POST',
                    body: raw,
                    headers: { 'Content-Type': 'application/json' }
                };
                promises.push(fetch(layer.url + "wfs", requestOptions)
                    .then(response => response.json())
                    .then(obj => {
                        return { id: layer.id, name: layer.name, data: obj, error: null, success: true }
                    })
                    .catch(err => {
                        return { id: layer.id, name: layer.name, data: null, error: err, success: false }
                    })
                );
            });
            Promise.all(promises)
                .then(response => {
                    return Promise.all(response)
                })
                .then(arr => {
                    return res.send({ error: false, success: true, response: arr })
                })
                .catch(err => {
                    return res.send({ error: err.message, success: false })
                });
            break;
        case 'simpleSearch':
            const body = req.body;
            const raw = `<wfs:GetFeature service="WFS" version="1.1.0" outputFormat="application/json" xmlns:wfs="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd"><wfs:Query typeName="${body.layer}"><ogc:Filter><ogc:PropertyIsLike matchCase="false" wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>${body.field}</ogc:PropertyName><ogc:Literal>*${body.queryParam}*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query></wfs:GetFeature>`
            const requestOptions = {
                method: 'POST',
                body: raw,
                headers: { 'Content-Type': 'application/json' }
            };
            fetch(body.url + 'wfs', requestOptions)
                .then(response => response.json())
                .then(obj => res.send(obj))
                .catch(err => res.send(err));
            break;
        default:
            return res.send({ error: 'Bad request', success: false })
    }
};