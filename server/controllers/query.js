import fetch from 'node-fetch';
import { makeBuffer, transform } from '../helpers/index.js';
import convert from 'xml-js';
let requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/xml' }
};
const handleTextResponse = (text, provider) => {
    switch (provider) {
        case 'GeoServer':
        case 'PentaOGC':
            return JSON.parse(text);
        case 'EsriOGC':
            return JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }));
        default:
            break;
    }
};
const handleProvider = provider => {
    let version;
    let format;
    switch (provider) {
        case 'EsriOGC':
            version = '1.0.0';
            format = 'GML2';
            break;
        case 'GeoServer':
        case 'PentaOGC':
            version = '1.1.0';
            format = 'application/json';
            break;
        default:
            break;
    }
    return [version, format];
};
export const ssearch = (req, res) => {
    const layers = req.body.layers;
    const promises = [];
    const search_type = req.body.type;
    layers.forEach(layer => {
        let buffer;
        let secured = layer.secured;
        let role;
        let token;
        let realm;
        let locale;
        let headers;
        if (secured) {
            role = layer.selectedRole;
            token = layer.token;
            realm = layer.tokenInfo.user.split('@')[1];
            locale = 'en';
            headers = {
                'PentaOrgID': realm,
                'PentaUserRole': role,
                'PentaSelectedLocale': locale,
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/xml'
            };
            requestOptions = { ...requestOptions, headers };
        }
        if (search_type === 'identify') {
            buffer = makeBuffer(layer.type, req.body.clickedPoint);
        }
        else {
            buffer = req.body.drawnPolygon;
        }
        const coords = buffer.map((point) =>
            transform("EPSG:3857", layer.crs, point).join(" ")
        );
        const queryParam = coords.join(" ");
        const [version, format] = handleProvider(layer.provider);
        const identifyBody = `<wfs:GetFeature service="WFS" outputFormat="${format}" version="${version}" xmlns:topp="http://www.openplans.org/topp" xmlns:wfs="http://www.opengis.net/wfs" xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Query typeName="${layer.name}"><Filter><Intersects><PropertyName>${layer.geometry}</PropertyName><gml:Polygon srsName="${layer.crs}"><gml:exterior><gml:LinearRing><gml:posList>${queryParam}</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></Intersects></Filter></wfs:Query></wfs:GetFeature>`;
        promises.push(fetch(layer.wfsURL, { ...requestOptions, body: identifyBody })
            .then(response => response.text())
            .then(text => handleTextResponse(text, layer.provider))
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
            return res.send({ error: false, success: true, response: response })
        })
        .catch(err => {
            return res.send({ error: err.message, success: false })
        });
};
export const tsearch = (req, res) => {
    const body = req.body;
    const [version, format] = handleProvider(body.provider);
    const searchBody = `<wfs:GetFeature service="WFS" version="${version}" outputFormat="${format}" xmlns:wfs="http://www.opengis.net/wfs" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd"><wfs:Query typeName="${body.layer}"><ogc:Filter><ogc:PropertyIsLike matchCase="false" wildCard="*" singleChar="." escapeChar="!"><ogc:PropertyName>${body.field}</ogc:PropertyName><ogc:Literal>*${body.queryParam}*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></wfs:Query></wfs:GetFeature>`
    let secured = body.secured === 1 ? true : false;
    let role;
    let token;
    let realm;
    let locale;
    let headers;
    if (secured) {
        role = body.role;
        token = body.token;
        realm = body.realm;
        locale = 'en';
        headers = {
            'PentaOrgID': realm,
            'PentaUserRole': role,
            'PentaSelectedLocale': locale,
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/xml'
        };
        requestOptions = { ...requestOptions, headers };
    };
    console.log(body);
    console.log('URL: ', body.url);
    console.log('Options: ', { ...requestOptions, body: searchBody });
    fetch(body.url, { ...requestOptions, body: searchBody })
        .then(response => response.text())
        .then(text => handleTextResponse(text, body.provider))
        .then(obj => {
            switch (body.provider) {
                case 'GeoServer':
                case 'PentaOGC':
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
};