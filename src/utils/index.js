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
    let x = point[0];
    let y = point[1];
    let p1 = [x - buffer, y + buffer];
    let p2 = [x + buffer, y + buffer];
    let p3 = [x + buffer, y - buffer];
    let p4 = [x - buffer, y - buffer];
    let p5 = p1;
    return { p1, p2, p3, p4, p5 }
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