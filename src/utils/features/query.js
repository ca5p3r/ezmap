const fetch = require("node-fetch");

let myHeaders = new fetch.Headers();
myHeaders.append("Content-Type", "application/xml");

let raw = "<wfs:GetFeature service=\"WFS\" version=\"1.1.0\" xmlns:topp=\"http://www.openplans.org/topp\" xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\"><wfs:Query typeName=\"topp:states\"><Filter><Intersects><PropertyName>the_geom</PropertyName><gml:Point srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\"><gml:coordinates>-74.817265,40.5296504</gml:coordinates></gml:Point></Intersects></Filter></wfs:Query></wfs:GetFeature>";

let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
};

fetch("https://ahocevar.com/geoserver/wfs", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));