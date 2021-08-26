import { Offcanvas, ButtonGroup, Button } from "react-bootstrap";
import {
    DragDropContext,
    Droppable,
    Draggable
} from 'react-beautiful-dnd';
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    setActiveLayers,
    triggerShowTOC,
    setMapExtent,
    setHistoricalLayers,
    triggerTOCChange,
    triggerShowLocalization,
    triggerToast,
    setLocalizedLayer,
    triggerIsLoading
} from "../../actions";
import convert from 'xml-js';
import { svg } from "../assets";
const TOC = () => {
    const dispatch = useDispatch();
    const activeLayers = useSelector(state => state.toc.activeLayers);
    const show = useSelector(state => state.toc.visibility);
    const historicalData = useSelector(state => state.toc.historicalData);
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const [reorderedItem] = activeLayers.splice(result.source.index, 1);
        activeLayers.splice(result.destination.index, 0, reorderedItem);
        dispatch(setActiveLayers(activeLayers));
        dispatch(triggerTOCChange(true));
    };
    const handleVisibility = (title) => {
        activeLayers.forEach(layer => {
            if (layer.values_.title === title) {
                layer.values_.visible = !layer.values_.visible
            }
        });
        historicalData.forEach(layer => {
            if (layer.id === title.split('&')[1]) {
                layer.visible = !layer.visible
            }
        });
        dispatch(setHistoricalLayers(historicalData));
        dispatch(setActiveLayers(null));
        dispatch(setActiveLayers(activeLayers));
        dispatch(triggerTOCChange(true));
    };
    const handleTransparency = (title, value) => {
        activeLayers.forEach(layer => {
            if (layer.values_.title === title) {
                layer.values_.opacity = value
            }
        });
        historicalData.forEach(layer => {
            if (layer.id === title.split('&')[1]) {
                layer.opacity = value
            }
        });
        dispatch(setHistoricalLayers(historicalData));
        dispatch(setActiveLayers(activeLayers));
        dispatch(triggerTOCChange(true));
    };
    const handleRemove = (title) => {
        const remainingLayers = activeLayers.filter(layer => layer.values_.title !== title);
        const tocRemainingLayers = historicalData.filter(item => item.id !== title.split('&')[1]);
        dispatch(setActiveLayers(remainingLayers));
        dispatch(setHistoricalLayers(tocRemainingLayers));
    };
    const handleGoTo = (title) => {
        const uniqueID = title.split('&')[1];
        const newExtent = (historicalData.filter(item => item.id === uniqueID))[0].extent;
        dispatch(setMapExtent(newExtent));
    };
    const handleAddLocal = (title) => {
        dispatch(triggerShowLocalization(true));
        dispatch(triggerShowTOC());
        dispatch(setLocalizedLayer(title.split('&')[1]));
    };
    const handleRefresh = (title) => {
        dispatch(triggerIsLoading(true));
        const layer = historicalData.filter(item => item.id === title.split('&')[1])[0];
        fetch(`${layer.url}?service=wfs&request=DescribeFeatureType&outputFormat=application/json&typeName=${layer.name}`)
            .then(response => response.text())
            .then(text => {
                switch (layer.provider) {
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
                const targetIndex = historicalData.findIndex(layer => layer.id === title.split('&')[1]);
                switch (layer.provider) {
                    case 'GeoServer':
                        fields = obj.featureTypes[0].properties;
                        formattedFields = fields.map(field => {
                            const obj = { name: field.name, type: field.localType, local: '' }
                            return obj
                        });
                        break;
                    case 'EsriOGC':
                        fields = obj['xsd:sequence']['xsd:element'];
                        formattedFields = fields.map(field => {
                            const obj = { name: field._attributes.name, type: field._attributes.type, local: '' }
                            return obj
                        });
                        break;
                    default:
                        return null;
                }
                layer.properties = formattedFields;
                historicalData.splice(targetIndex, 1);
                historicalData.splice(targetIndex, 0, layer);
                dispatch(setHistoricalLayers(historicalData));
                dispatch(triggerToast({
                    title: 'Success',
                    message: 'Layer has been refreshed!',
                    visible: true
                }));
                dispatch(triggerIsLoading());
            })
            .catch(err => {
                dispatch(triggerToast({
                    title: 'Danger',
                    message: err.message,
                    visible: true
                }));
            });
    };
    return (
        <Offcanvas className="custom" placement="end" backdrop={false} scroll={false} show={show} onHide={() => dispatch(triggerShowTOC())}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Table of contents</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="toc-list">
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef} className="container">
                                {activeLayers && activeLayers.map((layer, index) => {
                                    if (layer.values_.title.split('&')[1] !== 'h79mm8h') {
                                        return (
                                            <Draggable key={layer.values_.title} index={index} draggableId={layer.values_.title}>
                                                {(provided) => (
                                                    <li className="mb-3" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={layer.values_.visible}
                                                                id={`check${layer.values_.title}`}
                                                                objtitle={layer.values_.title}
                                                                onChange={e => {
                                                                    const element = e.target;
                                                                    const title = element.getAttribute('objtitle');
                                                                    handleVisibility(title);
                                                                }}
                                                            />
                                                            {layer.values_.title.split('&')[0]}
                                                        </div>
                                                        <div>
                                                            <input
                                                                className="form-range"
                                                                id={`slider${layer.values_.title}`}
                                                                objtitle={layer.values_.title}
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                defaultValue={layer.values_.opacity * 100}
                                                                step="10"
                                                                onChange={e => {
                                                                    const element = e.currentTarget;
                                                                    const title = element.getAttribute('objtitle');
                                                                    const value = element.value / 100;
                                                                    handleTransparency(title, value)
                                                                }} />
                                                        </div>
                                                        <div className={layer.values_.title === 'OpenStreetMap' ? 'hideen-group' : 'visible-group'}>
                                                            <ButtonGroup size="sm">
                                                                <Button
                                                                    variant="light"
                                                                    title='Remove'
                                                                    objtitle={layer.values_.title}
                                                                    onClick={e => {
                                                                        const element = e.currentTarget;
                                                                        const title = element.getAttribute('objtitle');
                                                                        handleRemove(title);
                                                                    }}
                                                                >{svg.remove}</Button>
                                                                <Button
                                                                    variant="light"
                                                                    title='GoTo'
                                                                    objtitle={layer.values_.title}
                                                                    onClick={e => {
                                                                        const element = e.currentTarget;
                                                                        const title = element.getAttribute('objtitle');
                                                                        handleGoTo(title);
                                                                    }}
                                                                >{svg.goto}</Button>
                                                                <Button
                                                                    variant="light"
                                                                    title='Update localization'
                                                                    objtitle={layer.values_.title}
                                                                    onClick={e => {
                                                                        const element = e.currentTarget;
                                                                        const title = element.getAttribute('objtitle');
                                                                        handleAddLocal(title);
                                                                    }}
                                                                >{svg.lang}</Button>
                                                                <Button
                                                                    variant="light"
                                                                    title='Refresh layer'
                                                                    objtitle={layer.values_.title}
                                                                    onClick={e => {
                                                                        const element = e.currentTarget;
                                                                        const title = element.getAttribute('objtitle');
                                                                        handleRefresh(title);
                                                                    }}
                                                                >{svg.refresh}</Button>
                                                            </ButtonGroup>
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        )
                                    }
                                    else {
                                        return null;
                                    }
                                }
                                )}
                                {provided.placeholder}
                            </ul>
                        )
                        }
                    </Droppable>
                </DragDropContext>
            </Offcanvas.Body>
        </Offcanvas>
    );
};
export default TOC;