import ImageWMS from 'ol/source/ImageWMS';
import Image from 'ol/layer/Image';
export const setter = (provider, url, id, title, name, opacity = 1, visible = true, secured = false, tokenInfo = {}, role) => {
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
    return new Image(
        {
            title: layerTitle,
            source: secured ? new ImageWMS(
                {
                    url: layerURL,
                    params: {
                        LAYERS,
                        VERSION: '1.1.1'
                    },
                    imageLoadFunction: function customLoader(tile, src) {
                        let client = new XMLHttpRequest();
                        client.open('GET', src);
                        client.setRequestHeader('PentaOrgID', tokenInfo.realm);
                        client.setRequestHeader('PentaSelectedLocale', 'en');
                        client.setRequestHeader('PentaUserRole', role);
                        client.setRequestHeader('Authorization', 'Bearer ' + tokenInfo.token);
                        client.onload = () => {
                            var data = 'data:image/png;base64,' + btoa(unescape(encodeURIComponent(this.responseText)));
                            tile.getImage().src = data;
                        };
                        client.send();
                    }
                }
            ) : new ImageWMS(
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
};
export const renderHeader = (header, provider) => {
    switch (provider) {
        case 'EsriOGC':
            return header._attributes.fid.split('.')[1];
        case 'GeoServer':
            return header.id.split('.')[1];
        default:
            return;
    }
};
export const constants = {
    backend_service: '192.168.1.111:9090'
}