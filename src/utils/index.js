import ImageWMS from 'ol/source/ImageWMS';
import Image from 'ol/layer/Image';
export const makeBuffer = (geom, point) => {
    let buffer;
    if (geom === 'Polygon' || geom === 'MultiPolygon') {
        buffer = 5
    }
    else {
        buffer = 100
    };
    const x = point[0];
    const y = point[1];
    const p1 = [x - buffer, y + buffer];
    const p2 = [x + buffer, y + buffer];
    const p3 = [x + buffer, y - buffer];
    const p4 = [x - buffer, y - buffer];
    const p5 = p1;
    return [p1, p2, p3, p4, p5]
};
export const setter = (url, title, name) => {
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