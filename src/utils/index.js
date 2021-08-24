import ImageWMS from 'ol/source/ImageWMS';
import Image from 'ol/layer/Image';
export const setter = (url, title, name, opacity, visible) => {
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
            ),
            opacity,
            visible
        }
    );
    return obj;
};