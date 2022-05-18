import ImageWMS from 'ol/source/ImageWMS';
import Image from 'ol/layer/Image';
import axios from 'axios';
export const setter = (provider, url, id, title, name, opacity = 1, visible = true, secured = false, tokenInfo = {}, role, token) => {
    const layerTitle = `${title}&${id}`;
    let layerURL;
    let LAYERS;
    switch (provider) {
        case 'GeoServer':
        case 'PentaOGC':
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
                        axios.get(src, {
                            headers: {
                                Authorization: 'Bearer ' + token,
                                PentaOrgID: tokenInfo.user.split('@')[1],
                                PentaSelectedLocale: 'en',
                                PentaUserRole: role
                            },
                            responseType: 'arraybuffer'
                        })
                            .then(({ data, _ }) => {
                                const base64 = btoa(
                                    new Uint8Array(data).reduce(
                                        (d, byte) => d + String.fromCharCode(byte),
                                        '',
                                    ),
                                );
                                tile.getImage().src = 'data:image/png;base64,' + base64;
                            }).catch(e => {
                                tile.getImage().dispatchEvent(new Event('error'));
                            })
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
        case 'PentaOGC':
            return header.id.split('.')[1];
        default:
            return;
    }
};
export const constants = {
    backend_service: process.env.REACT_APP_BACKEND_SERVICE
};