import { Table, Offcanvas } from "react-bootstrap";
import {
    triggerIdentifyVisibility
} from "../../actions";
import {
    useSelector,
    useDispatch
} from "react-redux";
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
                {results && results.map(
                    (result, key) => {
                        const resProps = layers.filter(layer => layer.id === result.id)[0].properties;
                        return (
                            <div key={key}>
                                <h6>Feature: {result.name}.{result.feature.id.split('.')[1]}</h6>
                                <Table striped bordered hover size="sm">
                                    <tbody>
                                        {resProps.map((item, key) => {
                                            const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection'];
                                            if (!geometries.includes(item.type)) {
                                                return (
                                                    <tr key={key}>
                                                        <td>{item.local ? item.local : item.name}</td>
                                                        <td>{result.feature.properties[item.name]}</td>
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
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};
export default Identify;