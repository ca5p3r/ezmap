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
    const layers = queriableLayers.map(layer => (
        <option id={`option+${layer.name}`} layerid={layer.id} url={layer.url} key={layer.name} value={layer.name}>
            {layer.title}
        </option>
    ));
    const fields = queriableLayers.find(item => item.name === layer)?.properties.map(field => {
        const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection', 'gml:MultiCurvePropertyType', 'gml:MultiSurfacePropertyType'];
        if (!geometries.includes(field.type)) {
            return (<option key={field.name} value={field.name}>
                {field.local ? field.local : field.name}
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
            const id = selectedElement.getAttribute('layerid');
            setData(data => ({ ...data, id, layer: e.target.value, field: '', value: '' }));
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
    const handleSearch = () => {
        if (layer !== 'Selector' && field && field !== 'Selector' && value) {
            const selectedLayer = document.getElementById('searchLayer').value;
            const selectedElement = document.getElementById(`option+${selectedLayer}`);
            const url = selectedElement.getAttribute('url');
            const data = {
                type: 'simpleSearch',
                url,
                layer,
                field,
                queryParam: value
            };
            dispatch(triggerIsLoading(true));
            fetch("http://localhost:9000/queryService/query", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok) {
                        dispatch(
                            triggerToast({
                                title: "Danger",
                                message: "Could not fetch data!",
                                visible: true,
                            })
                        );
                    }
                    return res.json();
                })
                .then(obj => {
                    if (obj.features.length > 0) {
                        setResults(obj.features);
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
                })
                .catch((error) => {
                    if (error.name !== "AbortError") {
                        dispatch(
                            triggerToast({
                                title: "Danger",
                                message: error.toString(),
                                visible: true,
                            })
                        );
                    }
                    dispatch(triggerIsLoading());
                    setResults([]);
                });
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
                        if (e.keyCode === 13) {
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
                                        const resProps = historicalData.filter(layer => layer.id === id)[0].properties;
                                        return (
                                            <div key={key}>
                                                <Alert className="mt-4 text-center" variant='info'>
                                                    Feature ID: {result.id.split('.')[1]}
                                                </Alert>
                                                <Table className="mt-4" striped bordered hover size="sm">
                                                    <tbody>
                                                        {resProps.map((item, key) => {
                                                            const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection', 'gml:MultiCurvePropertyType', 'gml:MultiSurfacePropertyType'];
                                                            if (!geometries.includes(item.type)) {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{item.local ? item.local : item.name}</td>
                                                                        <td>{result.properties[item.name]}</td>
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