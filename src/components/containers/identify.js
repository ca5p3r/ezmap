import { Button, Table } from "react-bootstrap";
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
    const layers = useSelector(state => state.toc.historicalData);
    return (
        <div className="identify">
            <div id="identify-body">
                <h2>Identify result</h2>
                {results && results.map(
                    (result, key) => {
                        const resProps = layers.filter(layer => layer.id === result.id)[0].properties;
                        return (
                            <div key={key}>
                                <h6>Feature: {result.name}.{result.feature.id.split('.')[1]}</h6>
                                <Table striped bordered hover size="sm">
                                    <tbody>
                                        {resProps.map((item, key) => {
                                            if (!item.name.includes('geom')) {
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
            </div>
            <div className="col text-center" id="identify-buttons">
                <Button variant="warning" onClick={() => dispatch(triggerIdentifyVisibility())}>
                    Dismiss
                </Button>
            </div>
        </div>
    );
};
export default Identify;