import fetch from 'node-fetch';
import { makeBuffer, tranform } from '../helpers/index.js';
import convert from 'xml-js';

export const query = (req, res) => {
    switch (req.body.type) {
        case 'query':
            const layers = req.body.layers;
            const promises = [];
            layers.forEach(layer => {
                let buffer;
                let coords;
                let version;
                let format;
                switch (req.body.subtype) {
                    case 'identify':
                        buffer = makeBuffer(layer.type, req.body.clickedPoint);
                        coords = buffer.map((point) =>
                            tranform("EPSG:3857", layer.crs, point).join(" ")
                        );
                        break;
                    case 'spatialSearch':
                        buffer = req.body.drawnPolygon;
                        coords = buffer.map((point) =>
                            tranform("EPSG:3857", layer.crs, point).join(" ")
                        );
                        break;
                    default:
                        break;
                }
                switch (layer.provider) {
                    case 'EsriOGC':
                        version = '1.0.0';
                        format = 'GML2';
                        break;
                    case 'GeoServer':
                        version = '1.1.0';
                        format = 'application/json';
                        break;
                    default:
                        break;
                }
                const queryParam = coords.join(" ");
                const raw = `<wfs:GetFeature service="WFS" outputFormat="${format}" version="${version}" xmlns:topp="http://www.openplans.org/topp" xmlns:wfs="http://www.opengis.net/wfs" xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Query typeName="${layer.name}"><Filter><Intersects><PropertyName>${layer.geometry}</PropertyName><gml:Polygon srsName="${layer.crs}"><gml:exterior><gml:LinearRing><gml:posList>${queryParam}</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></Intersects></Filter></wfs:Query></wfs:GetFeature>`;
                const requestOptions = {
                    method: 'POST',
                    body: raw,
                    headers: { 'Content-Type': 'application/json' }
                };
                promises.push(fetch(layer.url, requestOptions)
                    .then(response => response.text())
                    .then(text => {
                        switch (layer.provider) {
                            case 'GeoServer':
                                return JSON.parse(text);
                            case 'EsriOGC':
                                return JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }));
                            default:
                                break;
                        }
                    })
                    .then(obj => {
                        return { id: layer.id, provider: layer.provider, name: layer.name, data: obj, error: null, success: true }
                    })
                    .catch(err => {
                        return { id: layer.id, provider: layer.provider, name: layer.name, data: null, error: err, success: false }
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
            let version;
            let format;
            const body = req.body;
            switch (body.provider) {
                case 'EsriOGC':
                    version = '2.0.0';
                    format = 'GML2';
                    break;
                case 'GeoServer':
                    version = '1.1.0';
                    format = 'application/json';
                    break;
                default:
                    break;
            }
            const raw = `<wfs:GetFeature service="WFS" version="${version}" outputFormat="${format}" xmlns:wfs="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd"><wfs:Query typeName="${body.layer}"><ogc:Filter><ogc:PropertyIsLike matchCase="false" wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>${body.field}</ogc:PropertyName><ogc:Literal>*${body.queryParam}*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query></wfs:GetFeature>`
            const requestOptions = {
                method: 'POST',
                body: raw,
                headers: { 'Content-Type': 'application/json' }
            };
            fetch(body.url, requestOptions)
                .then(response => response.text())
                .then(text => {
                    switch (body.provider) {
                        case 'GeoServer':
                            return JSON.parse(text);
                        case 'EsriOGC':
                            return JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }));
                        default:
                            break;
                    }
                })
                .then(obj => {
                    switch (body.provider) {
                        case 'GeoServer':
                            res.send({ provider: body.provider, response: obj.features });
                            break;
                        case 'EsriOGC':
                            res.send({ provider: body.provider, response: obj['wfs:FeatureCollection']['gml:featureMember'] ? Object.entries(obj['wfs:FeatureCollection']['gml:featureMember']) : [] });
                            break;
                        default:
                            break;
                    }
                })
                .catch(err => res.send(err));
            break;
        default:
            return res.send({ error: 'Bad request', success: false })
    }
};