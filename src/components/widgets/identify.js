import { Button, Table } from "react-bootstrap";
const Identify = (props) => {
    return (
        <div className="identify">
            <div id="identify-body">
                <h2>Identify result</h2>
                {props.results && props.results.map(
                    result => {
                        return (
                            <div>
                                <h6>{result.id}</h6>
                                <Table striped bordered hover size="sm">
                                    <tbody>
                                        {Object.keys(result.properties).map(key => {
                                            return (
                                                <tr>
                                                    <td>{key}</td>
                                                    <td>{result.properties[key]}</td>
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
                <Button variant="warning" onClick={props.handleDismiss}>
                    Dismiss
                </Button>
            </div>
        </div>
    );
};
export default Identify;