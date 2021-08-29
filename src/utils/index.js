import ImageWMS from 'ol/source/ImageWMS';
import Image from 'ol/layer/Image';
export const setter = (provider, url, id, title, name, opacity = 1, visible = true) => {
    const layerTitle = `${title}&${id}`;
    let layerURL;
    let LAYERS;
    switch (provider) {
        case 'GeoServer':
            layerURL = url;
            LAYERS = [name];
            break;
        case 'EsriOGC':
            layerURL = url.slice(0, -9) + 'WMSServer';
            LAYERS = [title];
            break;
        default:
            layerURL = '';
            LAYERS = [];
            break;
    }
    const obj = new Image(
        {
            title: layerTitle,
            source: new ImageWMS(
                {
                    url: layerURL,
                    params: {
                        LAYERS,
                        VERSION: '1.1.1'
                    }
                }
            ),
            opacity,
            visible
        }
    );
    return obj;
};