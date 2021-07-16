import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
import {
    useSelector,
    useDispatch
} from 'react-redux';
import {
    updateLayers,
    resetLayers,
    addPendingLayer,
    showToast,
    setMessage,
    setToastColor
} from "../../actions";
import { hideWorkspace } from "../../actions";
import { useState } from "react";
import WMSCapabilities from 'ol/format/WMSCapabilities';
import setter from "../../utils/layers/setter";
const WorkspaceModal = () => {
    const [url, setUrl] = useState('');
    const [availability, setAvailability] = useState(false);
    const workspaceState = useSelector(state => state.workspace);
    const dispatch = useDispatch();
    const handleHide = () => {
        dispatch(hideWorkspace());
        setAvailability(false);
        dispatch(resetLayers());
        setUrl('');
    };
    const handleFetch = () => {
        const parser = new WMSCapabilities();
        if (url && url !== '') {
            fetch(`${url}?request=getCapabilities`)
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    const result = parser.read(text);
                    return result.Capability.Layer.Layer;
                })
                .then((arr) => {
                    dispatch(updateLayers(arr));
                    setAvailability(true);
                })
                .catch((err) => {
                    dispatch(setToastColor('danger'));
                    dispatch(setMessage({
                        title: 'Fetch error',
                        message: err.toString()
                    }));
                    dispatch(showToast());
                    dispatch(resetLayers());
                    setAvailability(false);
                });
        }
        else {
            dispatch(setToastColor('warning'));
            dispatch(setMessage({
                title: 'Warning',
                message: 'Please enter URL!'
            }));
            dispatch(showToast());
        };

    };
    const handleAdd = () => {
        if (availability) {
            let layerName = document.getElementById('formBasicLayer').value;
            let selectedElement = document.getElementById(`option${layerName}`);
            let layerTitle = selectedElement.getAttribute('title');
            if (layerName && layerName !== 'Selector') {
                const layerObj = setter(url, layerName, layerTitle);
                dispatch(addPendingLayer(layerObj));
            }
            else {
                dispatch(setToastColor('warning'));
                dispatch(setMessage({
                    title: 'Warning',
                    message: 'Please select a layer!'
                }));
                dispatch(showToast());
            };
        }
        else {
            dispatch(setToastColor('warning'));
            dispatch(setMessage({
                title: 'Warning',
                message: 'Please enter URL!'
            }));
            dispatch(showToast());
        };
    };
    return (
        <Modal show={workspaceState.showWorkspaceModal} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Workspace</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please provider layers info below!</p>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicUrl">
                        <Form.Label>URL</Form.Label>
                        <Form.Control type="text" placeholder="Enter server url" value={url} onChange={e => setUrl(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicUrl">
                        <Button variant="primary" onClick={handleFetch}>Fetch layers</Button>
                    </Form.Group>
                    {availability && <Form.Group className="mb-3" controlId="formBasicLayer">
                        <Form.Label>Select a layer</Form.Label>
                        <Form.Control as="select">
                            <option id="optionSelector" value="Selector">Select</option>
                            {workspaceState.layers.map(
                                (layer, key) => {
                                    return <option id={`option${layer.Name}`} key={key} value={layer.Name} title={layer.Title}>{layer.Title}</option>;
                                }
                            )}
                        </Form.Control>
                    </Form.Group>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleHide}>Dismiss</Button>
                <Button variant="success" onClick={handleAdd}>Add layer</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default WorkspaceModal;