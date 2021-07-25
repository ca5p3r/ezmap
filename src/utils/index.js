import ImageWMS from 'ol/source/ImageWMS';
import Image from 'ol/layer/Image';
export const makeBuffer = (point) => {
    let x = point[0];
    let y = point[1];
    let p1 = [x - 5, y + 5];
    let p2 = [x + 5, y + 5];
    let p3 = [x + 5, y - 5];
    let p4 = [x - 5, y - 5];
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