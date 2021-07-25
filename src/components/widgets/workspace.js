import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
import { useState } from "react";
const WorkspaceModal = (props) => {
    const [url, setUrl] = useState('');
    return (
        <Modal show={props.visibility} onHide={props.handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Workspace</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please provider layers info below!</p>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicUrl">
                        <Form.Label>URL</Form.Label>
                        <Form.Control type="text" placeholder="Example: https://example.com/geoserver/wms" value={url} onChange={e => setUrl(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicUrl">
                        <Button variant="primary" onClick={() => props.handleFetch(url)}>Fetch layers</Button>
                    </Form.Group>
                    {props.availability && <Form.Group className="mb-3" controlId="formBasicLayer">
                        <Form.Label>Select a layer</Form.Label>
                        <Form.Control as="select">
                            <option id="optionSelector" value="Selector">Select</option>
                            {props.layers.map(
                                (layer, key) => {
                                    return <option id={`option${layer.Name}`} key={key} crs={layer.CRS[0]} value={layer.Name} title={layer.Title} extent={layer.EX_GeographicBoundingBox}>{layer.Title}</option>;
                                }
                            )}
                        </Form.Control>
                    </Form.Group>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleHide}>Dismiss</Button>
                <Button variant="success" onClick={() => props.handleAdd(url)}>Add layer</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default WorkspaceModal;