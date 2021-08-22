import {
    Modal,
    Button,
    Form
} from "react-bootstrap";
import { useState } from "react";
import {
    useSelector,
    useDispatch
} from 'react-redux';
import {
    triggerShowLocalization,
    setLocalizedLayer,
    triggerToast,
    setHistoricalLayers
} from '../../actions';
const LocalizationModal = () => {
    const [locals, setLocals] = useState("");
    const dispatch = useDispatch();
    const visibility = useSelector(state => state.localization.visibility);
    const layerID = useSelector(state => state.localization.layerID);
    const data = useSelector(state => state.toc.historicalData);
    const handleChange = e => {
        if (e.target.files[0].name.endsWith('.json')) {
            const fileReader = new FileReader();
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = e => {
                setLocals(JSON.parse(e.target.result));
            };
        }
        else {
            setLocals(null);
            dispatch(triggerToast({
                title: 'Warning',
                message: 'Only JSON files are supported!',
                visible: true
            }));
        };
    };
    const handleHide = () => {
        setLocals(null);
        dispatch(setLocalizedLayer(null));
        dispatch(triggerShowLocalization(!visibility))
    };
    const handleAdd = () => {
        if (locals) {
            const targetIndex = data.findIndex(layer => layer.id === layerID);
            const targetLayer = data.filter(layer => layer.id === layerID)[0];
            targetLayer.properties.forEach(property => property.local = locals[property.name] ? locals[property.name] : null);
            data.splice(targetIndex, 1);
            data.splice(targetIndex, 0, targetLayer);
            dispatch(setHistoricalLayers(data));
            dispatch(triggerToast({
                title: 'Success',
                message: 'Localization has been added successfully!',
                visible: true
            }));
            handleHide();
        }
        else {
            dispatch(triggerToast({
                title: 'Warning',
                message: 'Please upload a valid localization file!',
                visible: true
            }));
        };
    };
    return (
        <Modal show={visibility} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>Localization</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please upload a localization file:</p>
                <Form>
                    <Form.Group className="mb-3" controlId="fileUpload">
                        <Form.Control type="file" accept=".json" placeholder="Choose file ..." onChange={handleChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button id="uploadButton" variant="primary" onClick={handleAdd}>Upload</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default LocalizationModal;