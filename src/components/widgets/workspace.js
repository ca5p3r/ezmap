import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { useState } from "react";
import {
    triggerShowWorkspace,
    resetLayers,
    triggerIsLoading,
    updateLayers,
    triggerToast,
    insertHistoricalLayer,
    addPendingLayer
} from '../../actions';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { transform } from "ol/proj";
import { v4 as uuidv4 } from 'uuid';
import { setter } from '../../utils';
const WorkspaceModal = () => {
    const dispatch = useDispatch();
    const [url, setUrl] = useState('');
    const [availability, setAvailability] = useState(false);
    const workspace = useSelector(state => state.workspace);
    const handleHide = () => {
        dispatch(triggerShowWorkspace());
        setAvailability(false);
        dispatch(resetLayers());
    };
    const handleFetch = (url) => {
        const parser = new WMSCapabilities();
        if (url && url !== '') {
            dispatch(triggerIsLoading(true));
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
                    dispatch(triggerIsLoading(false));
                })
                .catch((err) => {
                    dispatch(triggerToast({
                        title: 'Danger',
                        message: err.toString(),
                        visible: true
                    }));
                    dispatch(resetLayers());
                    setAvailability(false);
                    dispatch(triggerIsLoading(false));
                });
        }
        else {
            dispatch(triggerToast({
                title: 'Warning',
                message: 'Please enter URL!',
                visible: true
            }));
        };

    };
    const handleAdd = (url) => {
        if (availability) {
            let geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection'];
            let layerName = document.getElementById('formBasicLayer').value;
            let selectedElement = document.getElementById(`option${layerName}`);
            let layerTitle = selectedElement.getAttribute('title');
            let crs = selectedElement.getAttribute('crs');
            let uniqueID = uuidv4();
            let extentGeographic = selectedElement.getAttribute('extent');
            if (layerName && layerName !== 'Selector') {
                let p1 = transform(extentGeographic.split(',').slice(0, 2), 'EPSG:4326', 'EPSG:3857');
                let p2 = transform(extentGeographic.split(',').slice(2), 'EPSG:4326', 'EPSG:3857');
                fetch(`${url.slice(0, -3)}wfs?request=DescribeFeatureType&outputFormat=application/json&typeName=${layerName}`)
                    .then((response) => {
                        return response.text();
                    })
                    .then((text) => {
                        let obj = JSON.parse(text);
                        return obj;
                    })
                    .then((obj) => {
                        let fields = obj.featureTypes[0].properties
                        var geomField = fields.filter(field => geometries.includes(field.localType));
                        dispatch(insertHistoricalLayer({
                            id: uniqueID,
                            name: layerName,
                            title: layerTitle,
                            url: url.slice(0, -3),
                            extent: [...p1, ...p2],
                            type: geomField[0].localType,
                            geometry: geomField[0].name,
                            crs
                        }));
                    })
                    .catch(() => {
                        dispatch(insertHistoricalLayer({
                            id: uniqueID,
                            name: layerName,
                            title: layerTitle,
                            url: url.slice(0, -3),
                            extent: [...p1, ...p2],
                            type: null,
                            geometry: null,
                            crs
                        }));
                    });
                const obj = setter(url, `${layerTitle}&${uniqueID}`, layerName);
                dispatch(addPendingLayer(obj));
            }
            else {
                dispatch(triggerToast({
                    title: 'Warning',
                    message: 'Please select a layer!',
                    visible: true
                }));
            };
        }
        else {
            dispatch(triggerToast({
                title: 'Warning',
                message: 'Please enter URL!',
                visible: true
            }));
        };
    };
    return (
        <Modal show={workspace.visibility} onHide={handleHide}>
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
                        <Button variant="primary" onClick={() => handleFetch(url)}>Fetch layers</Button>
                    </Form.Group>
                    {availability && <Form.Group className="mb-3" controlId="formBasicLayer">
                        <Form.Label>Select a layer</Form.Label>
                        <Form.Control as="select">
                            <option id="optionSelector" value="Selector">Select</option>
                            {workspace.layers.map(
                                (layer, key) => {
                                    return <option id={`option${layer.Name}`} key={key} crs={layer.CRS[0]} value={layer.Name} title={layer.Title} extent={layer.EX_GeographicBoundingBox}>{layer.Title}</option>;
                                }
                            )}
                        </Form.Control>
                    </Form.Group>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleHide}>Dismiss</Button>
                <Button variant="success" onClick={() => handleAdd(url)}>Add layer</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default WorkspaceModal;