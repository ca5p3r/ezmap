import fetch from 'node-fetch';
import { makeBuffer, tranform } from '../helpers/index.js';
import convert from 'xml-js';

export const query = (req, res) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    switch (req.body.type) {
        case 'query':
            const layers = req.body.layers;
            const promises = [];
            layers.forEach(layer => {
                let buffer;
                let coords;
                let identifyVersion;
                let identifyFormat;
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
                        identifyVersion = '1.0.0';
                        identifyFormat = 'GML2';
                        break;
                    case 'GeoServer':
                        identifyVersion = '1.1.0';
                        identifyFormat = 'application/json';
                        break;
                    default:
                        break;
                }
                const queryParam = coords.join(" ");
                const identifyBody = `<wfs:GetFeature service="WFS" outputFormat="${identifyFormat}" version="${identifyVersion}" xmlns:topp="http://www.openplans.org/topp" xmlns:wfs="http://www.opengis.net/wfs" xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Query typeName="${layer.name}"><Filter><Intersects><PropertyName>${layer.geometry}</PropertyName><gml:Polygon srsName="${layer.crs}"><gml:exterior><gml:LinearRing><gml:posList>${queryParam}</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></Intersects></Filter></wfs:Query></wfs:GetFeature>`;
                promises.push(fetch(layer.url, { ...requestOptions, body: identifyBody })
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
            let searchVersion;
            let searchFormat;
            const body = req.body;
            switch (body.provider) {
                case 'EsriOGC':
                    searchVersion = '2.0.0';
                    searchFormat = 'GML2';
                    break;
                case 'GeoServer':
                    searchVersion = '1.1.0';
                    searchFormat = 'application/json';
                    break;
                default:
                    break;
            }
            const searchBody = `<wfs:GetFeature service="WFS" version="${searchVersion}" outputFormat="${searchFormat}" xmlns:wfs="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd"><wfs:Query typeName="${body.layer}"><ogc:Filter><ogc:PropertyIsLike matchCase="false" wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>${body.field}</ogc:PropertyName><ogc:Literal>*${body.queryParam}*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query></wfs:GetFeature>`
            fetch(body.url, { ...requestOptions, body: searchBody })
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