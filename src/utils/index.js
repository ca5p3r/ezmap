import ImageWMS from 'ol/source/ImageWMS';
import Image from 'ol/layer/Image';
export const setter = (url, name, title) => {
    const obj = new Image(
        {
            title: title,
            source: new ImageWMS(
                {
                    url: url,
                    params: {
                        LAYERS: [name],
                        VERSION: '1.1.1'
                    }
                }
            )
        }
    );
    return obj;
};
export const getFeatureByIdentify = (url, layerName, geomField, coords, srs) => {
    let data = null;
    let isLoading = true;
    let error = null;
    let myHeaders = new fetch.Headers();
    myHeaders.append("Content-Type", "application/xml");
    let raw = `<wfs:GetFeature service="WFS" version="1.1.0" xmlns:topp="http://www.openplans.org/topp" xmlns:wfs="http://www.opengis.net/wfs" xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Query typeName="${layerName}"><Filter><Intersects><PropertyName>${geomField}</PropertyName><gml:Polygon srsName="${srs}"><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates>${coords}</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></Intersects></Filter></wfs:Query></wfs:GetFeature>`;
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(url, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw Error('Could not fetch data from server!');
            };
            return res.json();
        })
        .then(response => response.text())
        .then(result => {
            data = result;
            isLoading = false;
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                isLoading = false;
                error = error.message;
            };
        });
    return { data, isLoading, error };
};