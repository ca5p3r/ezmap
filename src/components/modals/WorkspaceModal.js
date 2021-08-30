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
import convert from 'xml-js';
import { transform } from "ol/proj";
import { v4 as uuidv4 } from 'uuid';
import { setter } from '../../utils';
const WorkspaceModal = () => {
    const dispatch = useDispatch();
    const [url, setUrl] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [availability, setAvailability] = useState(false);
    const visibility = useSelector(state => state.workspace.visibility);
    const layers = useSelector(state => state.workspace.layers);
    const handleHide = () => {
        dispatch(triggerShowWorkspace());
        setAvailability(false);
        dispatch(resetLayers());
        setUrl('');
    };
    const handleTextResponse = (text, serviceType) => {
        const capabilityObject = JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }))['wfs:WFS_Capabilities'];
        switch (serviceType) {
            case 'EsriOGC':
                return capabilityObject['wfs:FeatureTypeList']['wfs:FeatureType'];
            case 'GeoServer':
                return capabilityObject.FeatureTypeList.FeatureType;
            default:
                return null
        }
    };
    const handleArray = arr => {
        if (arr) {
            dispatch(updateLayers(arr));
            setAvailability(true);
        }
        else {
            dispatch(triggerToast({
                title: 'Danger',
                message: 'Unable to fetch the given url with the given service type!',
                visible: true
            }));
        }
        dispatch(triggerIsLoading());
    };
    const handleError = () => {
        dispatch(triggerToast({
            title: 'Danger',
            message: 'Unable to fetch the given url with the given service type!',
            visible: true
        }));
        dispatch(resetLayers());
        setAvailability(false);
        dispatch(triggerIsLoading());
    }
    const handleFetch = (fetchurl) => {
        const serviceType = document.getElementById('serviceType').value;
        if (serviceType !== 'Selector') {
            setSelectedService(serviceType);
            if (fetchurl && fetchurl !== '') {
                dispatch(triggerIsLoading(true));
                fetch(`${fetchurl}?service=wfs&version=2.0.0&request=GetCapabilities`)
                    .then(response => response.text())
                    .then(text => handleTextResponse(text, serviceType))
                    .then(arr => handleArray(arr))
                    .catch(() => handleError);
            }
            else {
                dispatch(triggerToast({
                    title: 'Warning',
                    message: 'Please enter URL!',
                    visible: true
                }));
            }
        }
        else {
            dispatch(triggerToast({
                title: 'Warning',
                message: 'Please select all fields!',
                visible: true
            }));
        }
    };
    const handleAdd = (addurl) => {
        if (availability) {
            const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection', 'gml:MultiCurvePropertyType', 'gml:MultiSurfacePropertyType'];
            const layerName = document.getElementById('formBasicLayer').value;
            const selectedElement = document.getElementById(`option${layerName}`);
            const layerTitle = selectedElement.getAttribute('title');
            const crs = selectedElement.getAttribute('crs');
            const uniqueID = uuidv4();
            const extentGeographic = selectedElement.getAttribute('extent');
            let wmsURL;
            if (layerName && layerName !== 'Selector') {
                dispatch(triggerIsLoading(true));
                const p1 = transform(extentGeographic.split(' ').slice(0, 2), crs, 'EPSG:3857');
                const p2 = transform(extentGeographic.split(' ').slice(2), crs, 'EPSG:3857');
                fetch(`${addurl}?service=wfs&request=DescribeFeatureType&outputFormat=application/json&typeName=${layerName}`)
                    .then(response => response.text())
                    .then(text => {
                        switch (selectedService) {
                            case 'GeoServer':
                                return JSON.parse(text);
                            case 'EsriOGC':
                                return JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }))['xsd:schema']['xsd:complexType']['xsd:complexContent']['xsd:extension'];
                            default:
                                return null;
                        }
                    })
                    .then(obj => {
                        let fields;
                        let formattedFields;
                        let geomField;
                        let geomName;
                        let geomType;
                        switch (selectedService) {
                            case 'GeoServer':
                                wmsURL = url;
                                fields = obj.featureTypes[0].properties;
                                formattedFields = fields.map(field => {
                                    return { name: field.name, type: field.localType, local: '' }
                                });
                                geomField = fields.filter(field => geometries.includes(field.localType))[0];
                                geomName = geomField.name;
                                geomType = geomField.localType;
                                break;
                            case 'EsriOGC':
                                wmsURL = url.slice(0, -9) + 'WMSServer';
                                fields = obj['xsd:sequence']['xsd:element'];
                                formattedFields = fields.map(field => {
                                    return { name: field._attributes.name, type: field._attributes.type, local: '' }
                                });
                                geomField = fields.filter(field => geometries.includes(field._attributes.type))[0];
                                geomName = geomField._attributes.name;
                                geomType = geomField._attributes.type;
                                break;
                            default:
                                break;
                        }
                        dispatch(insertHistoricalLayer({
                            id: uniqueID,
                            name: layerName,
                            title: layerTitle,
                            provider: selectedService,
                            url,
                            wmsURL,
                            extent: [...p1, ...p2],
                            type: geomType,
                            geometry: geomName,
                            crs,
                            properties: formattedFields,
                            visible: true,
                            opacity: 1
                        }));
                        dispatch(triggerIsLoading());
                    })
                    .catch(() => {
                        dispatch(insertHistoricalLayer({
                            id: uniqueID,
                            name: layerName,
                            title: layerTitle,
                            provider: selectedService,
                            url,
                            wmsURL,
                            extent: [...p1, ...p2],
                            type: null,
                            geometry: null,
                            crs,
                            properties: null,
                            visible: true,
                            opacity: 1
                        }));
                        dispatch(triggerIsLoading());
                    });
                const wmsobject = setter(selectedService, url, uniqueID, layerTitle, layerName);
                dispatch(addPendingLayer(wmsobject));
            }
            else {
                dispatch(triggerToast({
                    title: 'Warning',
                    message: 'Please select a layer!',
                    visible: true
                }));
            }
        }
        else {
            dispatch(triggerToast({
                title: 'Warning',
                message: 'Please fetch layers first!',
                visible: true
            }));
        }
    };
    const handleURLChange = e => {
        setUrl(e.target.value);
        setAvailability(false);
    };
    const handleServiceChange = e => {
        setUrl('');
        setAvailability(false);
    };
    return (
        <Modal show={visibility} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Workspace</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please provider layers info below!</p>
                <Form>
                    <Form.Group className="mt-2 mb-2" controlId="serviceType">
                        <Form.Label>Select service type</Form.Label>
                        <Form.Control as="select" onChange={handleServiceChange}>
                            <option id="selector" value="Selector">Select</option>
                            <option id="esri-ogc" value="EsriOGC">ESRI OGC</option>
                            <option id="geoserver" value="GeoServer">GeoServer</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-2 mb-2" controlId="formBasicUrl">
                        <Form.Label>URL</Form.Label>
                        <Form.Control type="text" placeholder="Example: https://example.com/geoserver/wfs" value={url} onChange={handleURLChange} onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                document.getElementById("fetchLayersButton").click();
                            }
                        }} />
                    </Form.Group>
                    {availability && <Form.Group className="mt-2 mb-2" controlId="formBasicLayer">
                        <Form.Label>Select a layer</Form.Label>
                        <Form.Control as="select">
                            <option id="optionSelector" value="Selector">Select</option>
                            {
                                layers.map(
                                    (layer, key) => {
                                        switch (selectedService) {
                                            case 'GeoServer':
                                                return <option id={`option${layer.Name._text}`} key={key} crs={layer.DefaultCRS._text.split('crs:')[1].replace('::', ':')} value={layer.Name._text} title={layer.Title._text} extent={layer['ows:WGS84BoundingBox']['ows:LowerCorner']._text.replace(',', ' ') + ' ' + layer['ows:WGS84BoundingBox']['ows:UpperCorner']._text.replace(',', ' ')}>{layer.Title._text}</option>;
                                            case 'EsriOGC':
                                                return <option id={`option${layer['wfs:Name']._text}`} key={key} crs={layer['wfs:DefaultCRS']._text.split('crs:')[1].replace('::', ':')} value={layer['wfs:Name']._text} title={layer['wfs:Title']._text} extent={layer['ows:WGS84BoundingBox']['ows:LowerCorner']._text.replace(',', ' ') + ' ' + layer['ows:WGS84BoundingBox']['ows:UpperCorner']._text.replace(',', ' ')}>{layer['wfs:Title']._text}</option>;
                                            default:
                                                return null;
                                        }
                                    }
                                )
                            }
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