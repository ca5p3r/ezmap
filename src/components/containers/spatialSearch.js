import { Table, Alert, Offcanvas } from "react-bootstrap";
import {
    triggerSpatialSearchVisibility
} from "../../actions";
import {
    useSelector,
    useDispatch
} from "react-redux";
const SpatialSearch = () => {
    const dispatch = useDispatch();
    const results = useSelector(state => state.spatialSearch.result);
    const show = useSelector(state => state.spatialSearch.visibility);
    const layers = useSelector(state => state.toc.historicalData);
    const renderHeader = (header, provider) => {
        switch (provider) {
            case 'EsriOGC':
                return header._attributes.fid.split('.')[1];
            case 'GeoServer':
                return header.id.split('.')[1];
            default:
                return;
        }
    };
    return (
        <Offcanvas className="custom" placement="end" backdrop={false} scroll={false} show={show} onHide={() => dispatch(triggerSpatialSearchVisibility())}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Spatial search result</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {results.length > 0 &&
                    <>
                        <Alert className="mt-4 text-center" variant='success'>
                            Found {results.length} resutls!
                        </Alert>
                        {
                            results.map(
                                (result, key) => {
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
                                            properties = result.feature.properties
                                            break;
                                        default:
                                            break;
                                    };
                                    const resProps = layers.filter(layer => layer.id === result.id)[0].properties;
                                    return (
                                        <div key={key}>
                                            <Alert className="mt-4 text-center" variant='info'>
                                                Feature: {result.name}.{renderHeader(result.feature, result.provider)}
                                            </Alert>
                                            <Table striped bordered hover size="sm">
                                                <tbody>
                                                    {resProps.map((item, key) => {
                                                        const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection', 'gml:MultiCurvePropertyType', 'gml:MultiSurfacePropertyType'];
                                                        if (!geometries.includes(item.type)) {
                                                            return (
                                                                <tr key={key}>
                                                                    <td>{item.local ? item.local : item.name}</td>
                                                                    <td>{properties[item.name]}</td>
                                                                </tr>
                                                            )
                                                        }
                                                        else {
                                                            return null;
                                                        };
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
export default SpatialSearch;