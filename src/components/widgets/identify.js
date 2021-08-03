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
    return (
        <div className="identify">
            <div id="identify-body">
                <h2>Identify result</h2>
                {results && results.map(
                    (result, key) => {
                        return (
                            <div key={key}>
                                <h6>{result.id}</h6>
                                <Table striped bordered hover size="sm">
                                    <tbody>
                                        {Object.keys(result.properties).map((item, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td>{item}</td>
                                                    <td>{result.properties[item]}</td>
                                                </tr>
                                            )
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