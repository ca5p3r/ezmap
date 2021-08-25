import { Form, Button, Table, Offcanvas } from "react-bootstrap";
import {
    triggerSimpleSearch
} from "../../actions";
import {
    useSelector,
    useDispatch
} from "react-redux";
import { useState } from "react";
const SimpleSearch = () => {
    const [{ layer, field }, setData] = useState({
        layer: "Select",
        field: "Select"
    });
    const dispatch = useDispatch();
    const show = useSelector(state => state.simpleSearch.visibility);
    const historicalData = useSelector(state => state.toc.historicalData);
    const queriableLayers = historicalData.filter(item => item.geometry !== null);
    const layers = queriableLayers.map(layer => (
        <option key={layer.name} value={layer.name}>
            {layer.name}
        </option>
    ));
    const fields = queriableLayers.find(item => item.name === layer)?.properties.map(field => {
        const geometries = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiPolygon', 'MultiLineString', 'GeometryCollection'];
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
        setData({ field: '', layer: e.target.value });
    };
    const handleFieldChange = e => {
        setData(data => ({ ...data, field: e.target.value }));
    };
    const handleSearch = (layer, field) => {
    };
    return (
        <Offcanvas className="custom" placement="end" backdrop={false} scroll={false} show={show} onHide={() => dispatch(triggerSimpleSearch())}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Simple search</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Form.Group className="mt-2" controlId="searchLayer">
                        <Form.Label>Select a layer</Form.Label>
                        <Form.Control as="select" value={layer} onChange={handleLayerChange}>
                            <option value="Selector">Select</option>
                            {layers}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-2" controlId="searchField">
                        <Form.Label>Select a field</Form.Label>
                        <Form.Control as="select" value={field} onChange={handleFieldChange}>
                            <option value="Selector">Select</option>
                            {fields}
                        </Form.Control>
                    </Form.Group>
                    <div className="d-grid gap-2 mt-4">
                        <Button id="searchButton" variant="success" onClick={() => handleSearch(layer, field)}>
                            Search
                        </Button>
                    </div>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};
export default SimpleSearch;