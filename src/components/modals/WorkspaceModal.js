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
import jwt_decode from "jwt-decode";
import { setter, constants } from '../../utils';
const backend_service = constants.backend_service;
const WorkspaceModal = () => {
    const dispatch = useDispatch();
    const [url, setUrl] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [secured, setSecured] = useState(false);
    const [secureMethod, setSecureMethod] = useState('');
    const [availability, setAvailability] = useState(false);
    const [tokenInfo, setTokenInfo] = useState({});
    const [token, setToken] = useState('');
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const visibility = useSelector(state => state.workspace.visibility);
    const layers = useSelector(state => state.workspace.layers);
    const handleHide = () => {
        dispatch(triggerShowWorkspace());
        setAvailability(false);
        dispatch(resetLayers());
        setUrl('');
        setToken('');
        setSecured(false);
        setSecureMethod('');
    };
    const handleTextResponse = (text, serviceType) => {
        let capabilityObject;
        switch (serviceType) {
            case 'EsriOGC':
                capabilityObject = JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }))['wfs:WFS_Capabilities'];
                return capabilityObject['wfs:FeatureTypeList']['wfs:FeatureType'];
            case 'GeoServer':
                capabilityObject = JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }))['wfs:WFS_Capabilities'];
                if (Array.isArray(capabilityObject.FeatureTypeList.FeatureType)) {
                    return capabilityObject.FeatureTypeList.FeatureType;
                }
                else {
                    let layersArr = [];
                    layersArr.push(capabilityObject.FeatureTypeList.FeatureType);
                    return layersArr
                }
            case 'PentaOGC':
                capabilityObject = JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }))['WMS_Capabilities']['Capability'];
                if (Array.isArray(capabilityObject.Layer.Layer)) {
                    return capabilityObject.Layer.Layer;
                }
                else {
                    let layersArr = [];
                    layersArr.push(capabilityObject.Layer.Layer);
                    return layersArr
                }
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
        setToken('');
    }
    const handleFetch = () => {
        const serviceType = document.getElementById('serviceType').value;
        if (serviceType !== 'Selector') {
            if (url && url !== '') {
                dispatch(triggerIsLoading(true));
                let fetchURL;
                let requestParams = {};
                let separator;
                if (serviceType === 'PentaOGC') {
                    separator = '&';
                    if (token && tokenInfo.user) {
                        requestParams = {
                            method: 'GET',
                            headers: {
                                'PentaOrgID': tokenInfo.user.split('@')[1],
                                'PentaUserRole': selectedRole,
                                'PentaSelectedLocale': 'en',
                                'Authorization': 'Bearer ' + token
                            }

                        }
                    };
                }
                else {
                    separator = '?';
                }
                fetchURL = `${url}${separator}service=wfs&version=2.0.0&request=GetCapabilities`;
                fetch(fetchURL, requestParams)
                    .then(response => response.text())
                    .then(text => handleTextResponse(text, serviceType))
                    .then(arr => handleArray(arr))
                    .catch(() => handleError())
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
    const handleAdd = () => {
        if (availability) {
            const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection', 'gml:MultiCurvePropertyType', 'gml:MultiSurfacePropertyType'];
            const layerName = document.getElementById('formBasicLayer').value;
            const selectedElement = document.getElementById(`option${layerName}`);
            const layerTitle = selectedElement.getAttribute('title');
            const crs = selectedElement.getAttribute('crs');
            const uniqueID = uuidv4();
            const extentGeographic = selectedElement.getAttribute('extent');
            let wmsURL;
            let wfsURL;
            let addURL;
            if (selectedService === 'PentaOGC') {
                wmsURL = url.split('?')[0].slice(0, -12);
                wfsURL = url.split('?')[0].slice(0, -15) + 'wfs';
                addURL = url.split('?')[0].slice(0, -15) + `describeFeatureType?typeName=${layerName}`;
            }
            else if (selectedService === 'GeoServer') {
                wmsURL = url.slice(0, -3) + 'wms';
                wfsURL = url;
                addURL = url + `?service=wfs&request=DescribeFeatureType&outputFormat=application/json&typeName=${layerName}`;
            }
            else if (selectedService === 'EsriOGC') {
                wmsURL = url.slice(0, -9) + 'WMSServer';
                wfsURL = url;
                addURL = url + `?service=wfs&request=DescribeFeatureType&outputFormat=application/json&typeName=${layerName}`;
            }
            if (layerName && layerName !== 'Selector') {
                dispatch(triggerIsLoading(true));
                const p1 = transform(extentGeographic.split(' ').slice(0, 2), 'EPSG:4326', 'EPSG:3857');
                const p2 = transform(extentGeographic.split(' ').slice(2), 'EPSG:4326', 'EPSG:3857');
                let requestParams;
                if (selectedService === 'PentaOGC') {
                    requestParams = {
                        method: 'GET',
                        headers: {
                            'PentaOrgID': tokenInfo.user.split('@')[1],
                            'PentaUserRole': selectedRole,
                            'PentaSelectedLocale': 'en',
                            'Authorization': 'Bearer ' + token
                        }
                    };
                }
                else {
                    requestParams = {}
                }
                fetch(addURL, requestParams)
                    .then(response => response.text())
                    .then(text => {
                        switch (selectedService) {
                            case 'GeoServer':
                            case 'PentaOGC':
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
                            case 'PentaOGC':
                                fields = obj.featureTypes[0].properties;
                                formattedFields = fields.map(field => {
                                    return { name: field.name, type: field.localType, local: '' }
                                });
                                geomField = fields.filter(field => geometries.includes(field.localType))[0];
                                geomName = geomField.name;
                                geomType = geomField.localType;
                                break;
                            case 'EsriOGC':
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
                            secured,
                            tokenInfo,
                            selectedRole,
                            token,
                            wmsURL,
                            wfsURL,
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
                            secured,
                            tokenInfo,
                            token,
                            selectedRole,
                            wmsURL,
                            wfsURL,
                            extent: [...p1, ...p2],
                            type: null,
                            geometry: null,
                            crs,
                            properties: null,
                            visible: true,
                            opacity: 1
                        }));
                        dispatch(triggerIsLoading());
                    })
                const wmsobject = setter(selectedService, wmsURL, uniqueID, layerTitle, layerName, 1, true, secured, tokenInfo, selectedRole, token);
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
        let value = e.target.value;
        if (e.target.value === 'Selector') {
            value = ''
        }
        setSelectedService(value);
        setSecured(false);
        setUrl('');
        setAvailability(false);
    };
    return (
        <Modal show={visibility} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Workspace</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mt-2 mb-2" controlId="serviceType">
                        <Form.Label>Select service type</Form.Label>
                        <Form.Control as="select" onChange={handleServiceChange}>
                            <option id="selector" value="Selector">Please select one of below types</option>
                            <option id="geoserver" value="GeoServer">GeoServer (Public only)</option>
                            <option id="esri-ogc" value="EsriOGC">ESRI OGC (Public only)</option>
                            <option id="penta-ogc" value="PentaOGC">Guardian edition (Secured only)</option>
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
                        {selectedService === 'PentaOGC' && <Form.Check
                            checked={secured}
                            onChange={_ => setSecured(!secured)}
                            className="mt-2 mb-2"
                            type="switch"
                            id="secured-switch"
                            label="is secured?"
                        />}
                        {secured && <>
                            <Form.Control className="mt-2 mb-2" as="select" onChange={e => {
                                let method = e.target.value;
                                if (method === 'Selector') {
                                    method = '';
                                }
                                setSecureMethod(method);
                            }}>
                                <option id="selector" value="Selector">Please select authentication method</option>
                                {/* <option id="creds" value="Credentials">Credentials (User/Password)</option> */}
                                <option id="token" value="Token">JWT Token (Keycloak)</option>
                            </Form.Control>
                            {secureMethod && <>
                                {secureMethod === 'Token' && <Form.Control className="mt-2 mb-2" type="text" placeholder="Example: username@realm" onChange={e => {
                                    let info = { ...tokenInfo, user: e.target.value };
                                    setTokenInfo(info);
                                }} />}
                                {secureMethod === 'Credentials' && <Form.Control className="mt-2 mb-2" type="text" placeholder="Enter your username here" />}
                                <Form.Control className="mt-2 mb-2" type="password" placeholder="Enter your password here" onChange={e => {
                                    if (secureMethod === 'Token') {
                                        let info = { ...tokenInfo, password: e.target.value };
                                        setTokenInfo(info);
                                    }
                                }} />
                                {secureMethod === 'Token' && <Button className="mt-2 mb-2" variant="secondary" onClick={() => {
                                    if (tokenInfo.user && tokenInfo.password) {
                                        let username = tokenInfo.user.split('@')[0];
                                        let password = tokenInfo.password;
                                        let realm = tokenInfo.user.split('@')[1];
                                        dispatch(triggerIsLoading(true));
                                        fetch(`http://${backend_service}/authService/gen_token`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ username, password, realm })
                                        })
                                            .then(response => response.json())
                                            .then(result => {
                                                if (result.code === 200) {
                                                    setToken(result.token);
                                                    let decoded = jwt_decode(result.token);
                                                    let kcRoles = ['default-roles-myrealm', 'offline_access', 'uma_authorization'];
                                                    let info = { ...tokenInfo, roles: [...decoded.realm_access.roles.filter(role => !kcRoles.includes(role))] };
                                                    setTokenInfo(info);
                                                    setRoles([...info.roles]);
                                                    dispatch(triggerToast({
                                                        title: 'Success',
                                                        message: 'Token was generated successfully!',
                                                        visible: true
                                                    }));
                                                }
                                                else {
                                                    setToken(result.token);
                                                    dispatch(triggerToast({
                                                        title: 'Danger',
                                                        message: result.error,
                                                        visible: true
                                                    }));
                                                };
                                                dispatch(triggerIsLoading());
                                            })
                                            .catch(() => handleError())
                                    }
                                }}>Generate</Button>}
                                {secureMethod === 'Credentials' && <Button className="mt-2 mb-2" variant="secondary">Authenticate</Button>}
                                {token && <>
                                    <Form.Control className="mt-2 mb-2" as="select" onChange={e => {
                                        let role = e.target.value;
                                        if (role === 'Selector') {
                                            role = '';
                                        }
                                        setSelectedRole(role);
                                    }}>
                                        <option id="selector" value="Selector">Please select a role</option>
                                        {
                                            roles.map(
                                                (role, key) => {
                                                    return <option id={`option${role}`} key={key} value={role}>{role}</option>;
                                                }
                                            )
                                        }
                                    </Form.Control>
                                </>}
                            </>}
                        </>}
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
                                            case 'PentaOGC':
                                                return <option id={`option${layer.Name._text}`} key={key} crs={layer.CRS[0]._text} value={layer.Name._text} title={layer.Title._text} extent={layer['EX_GeographicBoundingBox']['westBoundLongitude']._text + ' ' + layer['EX_GeographicBoundingBox']['southBoundLatitude']._text + ' ' + layer['EX_GeographicBoundingBox']['westBoundLongitude']._text + ' ' + layer['EX_GeographicBoundingBox']['northBoundLatitude']._text}>{layer.Title._text}</option>;
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
                <Button id="fetchLayersButton" variant="primary" onClick={() => handleFetch()}>Fetch layers</Button>
                <Button variant="success" onClick={() => handleAdd()}>Add layer</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default WorkspaceModal;