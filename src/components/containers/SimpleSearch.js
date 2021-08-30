import { Form, Button, Alert, Table, Offcanvas } from "react-bootstrap";
import {
    triggerSimpleSearch,
    triggerToast,
    triggerIsLoading
} from "../../actions";
import {
    useSelector,
    useDispatch
} from "react-redux";
import { useState } from "react";
import { renderHeader } from "../../utils";
const SimpleSearch = () => {
    const [{ id, layer, field, value }, setData] = useState({
        id: "",
        layer: "",
        field: "",
        value: ""
    });
    const [results, setResults] = useState([]);
    const dispatch = useDispatch();
    const show = useSelector(state => state.simpleSearch.visibility);
    const historicalData = useSelector(state => state.toc.historicalData);
    const queriableLayers = historicalData.filter(item => item.geometry !== null);
    const layers = queriableLayers.map(item => (
        <option id={`option+${item.name}`} layerid={item.id} provider={item.provider} url={item.url} key={item.name} value={item.name}>
            {item.title}
        </option>
    ));
    const fields = queriableLayers.find(item => item.name === layer)?.properties.map(property => {
        const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection', 'gml:MultiCurvePropertyType', 'gml:MultiSurfacePropertyType'];
        if (!geometries.includes(property.type)) {
            return (<option key={property.name} value={property.name}>
                {property.local ? property.local : property.name}
            </option>)
        }
        else {
            return null
        }
    });
    const handleLayerChange = e => {
        const selectedLayer = document.getElementById('searchLayer').value;
        if (selectedLayer !== 'Selector') {
            const selectedElement = document.getElementById(`option+${selectedLayer}`);
            const layerID = selectedElement.getAttribute('layerid');
            setData(data => ({ ...data, id: layerID, layer: e.target.value, field: '', value: '' }));
            setResults([]);
        }
        else {
            setData(data => ({ ...data, id: "", layer: "", field: '', value: '' }));
            setResults([]);
        }
    };
    const handleFieldChange = e => {
        setData(data => ({ ...data, field: e.target.value }));
        setResults([]);
    };
    const handleInitialResponse = response => {
        if (!response.ok) {
            dispatch(
                triggerToast({
                    title: "Danger",
                    message: "Could not fetch data!",
                    visible: true,
                })
            );
        }
        return response.json();
    };
    const handleJSONResponse = obj => {
        let queryResults = [];
        if (obj.response.length > 0) {
            switch (obj.provider) {
                case 'GeoServer':
                    obj.response.forEach(item => queryResults.push({ provider: obj.provider, feature: item }));
                    break;
                case 'EsriOGC':
                    if (obj.response.length > 1) {
                        obj.response.forEach(item => queryResults.push({ provider: obj.provider, feature: Object.entries(item[1])[0][1] }));
                    }
                    else {
                        queryResults.push({ provider: obj.provider, feature: obj.response[0][1] });
                    }
                    break;
                default:
                    break;
            }
            setResults(queryResults);
        }
        else {
            setResults([]);
            dispatch(
                triggerToast({
                    title: "Warning",
                    message: 'No results found!',
                    visible: true,
                })
            );
        }
        dispatch(triggerIsLoading());
    };
    const hnadleFetchError = err => {
        if (err.name !== "AbortError") {
            dispatch(
                triggerToast({
                    title: "Danger",
                    message: err.toString(),
                    visible: true,
                })
            );
        }
        dispatch(triggerIsLoading());
        setResults([]);
    };
    const handleSearch = () => {
        if (layer !== 'Selector' && field && field !== 'Selector' && value) {
            const selectedLayer = document.getElementById('searchLayer').value;
            const selectedElement = document.getElementById(`option+${selectedLayer}`);
            const url = selectedElement.getAttribute('url');
            const provider = selectedElement.getAttribute('provider');
            const data = {
                url,
                layer,
                field,
                provider,
                queryParam: value
            };
            dispatch(triggerIsLoading(true));
            fetch("http://localhost:9090/queryService/tsearch", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(res => handleInitialResponse(res))
                .then(obj => handleJSONResponse(obj))
                .catch(error => hnadleFetchError(error));
        }
        else {
            dispatch(
                triggerToast({
                    title: "Warning",
                    message: "Please fill all data!",
                    visible: true,
                })
            );
        }
    };
    return (
        <Offcanvas className="custom" placement="end" backdrop={false} scroll={false} show={show} onHide={() => dispatch(triggerSimpleSearch())}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Simple search</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Form.Group className="mt-2" controlId="searchLayer">
                        <Form.Control as="select" value={layer} onChange={handleLayerChange}>
                            <option value="Selector">Select layer</option>
                            {layers}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-2" controlId="searchField">
                        <Form.Control as="select" value={field} onChange={handleFieldChange}>
                            <option value="Selector" layerid="">Select field</option>
                            {fields}
                        </Form.Control>
                    </Form.Group>
                    <Form.Control className="mt-2" type="text" placeholder="Enter search value:" value={value} onChange={e => {
                        setData(data => ({ ...data, value: e.target.value }));
                        setResults([]);
                    }
                    } onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            document.getElementById("searchButton").click();
                        }
                    }} />
                    <div className="d-grid gap-2 mt-4">
                        <Button id="searchButton" variant="success" onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                    {results.length > 0 &&
                        <>
                            <Alert className="mt-4 text-center" variant='success'>
                                Found {results.length} resutls!
                            </Alert>
                            {
                                results.map(
                                    (result, key) => {
                                        let properties = {};
                                        switch (result.provider) {
                                            case 'EsriOGC':
                                                const oldProps = Object.entries(result.feature).slice(1);
                                                oldProps.forEach(item => {
                                                    const head = item[0].split(':')[1];
                                                    const peropertyValue = item[1]._text;
                                                    properties[head] = peropertyValue;
                                                })
                                                break;
                                            case 'GeoServer':
                                                properties = result.feature.properties
                                                break;
                                            default:
                                                break;
                                        }
                                        const resProps = historicalData.filter(item => item.id === id)[0].properties;
                                        return (
                                            <div key={key}>
                                                <Alert className="mt-4 text-center" variant='info'>
                                                    Feature: {result.name}.{renderHeader(result.feature, result.provider)}
                                                </Alert>
                                                <Table className="mt-4" striped bordered hover size="sm">
                                                    <tbody>
                                                        {resProps.map((item, resultKey) => {
                                                            const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection', 'gml:MultiCurvePropertyType', 'gml:MultiSurfacePropertyType'];
                                                            if (!geometries.includes(item.type)) {
                                                                return (
                                                                    <tr key={resultKey}>
                                                                        <td>{item.local ? item.local : item.name}</td>
                                                                        <td>{properties[item.name]}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                            else {
                                                                return null;
                                                            }
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </>
                    }
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};
export default SimpleSearch;