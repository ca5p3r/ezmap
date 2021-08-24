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
    const visibility = useSelector(state => state.workspace.visibility);
    const layers = useSelector(state => state.workspace.layers);
    const handleHide = () => {
        dispatch(triggerShowWorkspace());
        setAvailability(false);
        dispatch(resetLayers());
        setUrl('');
    };
    const handleFetch = (url) => {
        const parser = new WMSCapabilities();
        if (url && url !== '') {
            dispatch(triggerIsLoading(true));
            fetch(`${url}?request=getCapabilities`)
                .then(response => response.text())
                .then(text => {
                    const result = parser.read(text);
                    return result.Capability.Layer.Layer;
                })
                .then(arr => {
                    dispatch(updateLayers(arr));
                    setAvailability(true);
                    dispatch(triggerIsLoading());
                })
                .catch(err => {
                    dispatch(triggerToast({
                        title: 'Danger',
                        message: err.toString(),
                        visible: true
                    }));
                    dispatch(resetLayers());
                    setAvailability(false);
                    dispatch(triggerIsLoading());
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
            const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection'];
            const layerName = document.getElementById('formBasicLayer').value;
            const selectedElement = document.getElementById(`option${layerName}`);
            const layerTitle = selectedElement.getAttribute('title');
            const crs = selectedElement.getAttribute('crs');
            const uniqueID = uuidv4();
            const extentGeographic = selectedElement.getAttribute('extent');
            if (layerName && layerName !== 'Selector') {
                const p1 = transform(extentGeographic.split(',').slice(0, 2), 'EPSG:4326', 'EPSG:3857');
                const p2 = transform(extentGeographic.split(',').slice(2), 'EPSG:4326', 'EPSG:3857');
                fetch(`${url.slice(0, -3)}wfs?request=DescribeFeatureType&outputFormat=application/json&typeName=${layerName}`)
                    .then(response => response.text())
                    .then(text => {
                        const obj = JSON.parse(text);
                        return obj;
                    })
                    .then(obj => {
                        const fields = obj.featureTypes[0].properties
                        const formattedFields = fields.map(field => {
                            const obj = { name: field.name, type: field.localType, local: '' }
                            return obj
                        });
                        const geomField = fields.filter(field => geometries.includes(field.localType));
                        dispatch(insertHistoricalLayer({
                            id: uniqueID,
                            name: layerName,
                            title: layerTitle,
                            url: url.slice(0, -3),
                            extent: [...p1, ...p2],
                            type: geomField[0].localType,
                            geometry: geomField[0].name,
                            crs,
                            properties: formattedFields,
                            visible: true,
                            opacity: 1
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
                            crs,
                            properties: null,
                            visible: true,
                            opacity: 1
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
                message: 'Please fetch layers first!',
                visible: true
            }));
        };
    };
    return (
        <Modal show={visibility} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Workspace</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please provider layers info below!</p>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicUrl">
                        <Form.Label>URL</Form.Label>
                        <Form.Control type="text" placeholder="Example: https://example.com/geoserver/wms" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => {
                            if (e.keyCode === 13) {
                                e.preventDefault();
                                document.getElementById("fetchLayersButton").click();
                            }
                        }} />
                    </Form.Group>
                    {availability && <Form.Group className="mb-3" controlId="formBasicLayer">
                        <Form.Label>Select a layer</Form.Label>
                        <Form.Control as="select">
                            <option id="optionSelector" value="Selector">Select</option>
                            {layers.map(
                                (layer, key) => {
                                    return <option id={`option${layer.Name}`} key={key} crs={layer.CRS[0]} value={layer.Name} title={layer.Title} extent={layer.EX_GeographicBoundingBox}>{layer.Title}</option>;
                                }
                            )}
                        </Form.Control>
                    </Form.Group>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="fetchLayersButton" variant="primary" onClick={() => handleFetch(url)}>Fetch layers</Button>
                <Button variant="success" onClick={() => handleAdd(url)}>Add layer</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default WorkspaceModal;