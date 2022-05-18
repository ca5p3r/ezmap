import { Table, Alert, Offcanvas } from "react-bootstrap";
import {
    triggerIdentifyVisibility
} from "../../actions";
import {
    useSelector,
    useDispatch
} from "react-redux";
import { renderHeader } from '../../utils';
const Identify = () => {
    const dispatch = useDispatch();
    const results = useSelector(state => state.identify.result);
    const show = useSelector(state => state.identify.visibility);
    const layers = useSelector(state => state.toc.historicalData);
    return (
        <Offcanvas className="custom" placement="end" backdrop={false} scroll={false} show={show} onHide={() => dispatch(triggerIdentifyVisibility())}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Identify result</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {results.length > 0 &&
                    <>
                        <Alert className="mt-4 text-center" variant='success'>
                            Found {results.length} resutls!
                        </Alert>
                        {
                            results.map(
                                (result, layerKey) => {
                                    let properties = {};
                                    switch (result.provider) {
                                        case 'EsriOGC':
                                            const oldProps = Object.entries(result.feature).slice(1);
                                            oldProps.forEach(item => {
                                                const head = item[0].split(':')[1];
                                                const value = item[1]._text;
                                                properties[head] = value;
                                            })
                                            break;
                                        case 'GeoServer':
                                        case 'PentaOGC':
                                            properties = result.feature.properties
                                            break;
                                        default:
                                            break;
                                    }
                                    const resProps = layers.filter(layer => layer.id === result.id)[0].properties;
                                    return (
                                        <div key={layerKey}>
                                            <Alert className="mt-4 text-center" variant='info'>
                                                Feature: {result.name}.{renderHeader(result.feature, result.provider)}
                                            </Alert>
                                            <Table striped bordered hover size="sm">
                                                <tbody>
                                                    {resProps.map((item, resultKey) => {
                                                        const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection', 'gml:MultiCurvePropertyType', 'gml:MultiSurfacePropertyType'];
                                                        if (!geometries.includes(item.type)) {
                                                            return (
                                                                <tr key={resultKey}>
                                                                    <td>{item.local ? item.local : item.name}</td>
                                                                    <td>{properties[item.name]}</td>
                                                                </tr>
                                                            )
                                                        }
                                                        else {
                                                            return null;
                                                        }
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    )
                                }
                            )
                        }
                    </>
                }
            </Offcanvas.Body>
        </Offcanvas>
    );
};
export default Identify;