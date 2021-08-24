import { Offcanvas } from "react-bootstrap";
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
    setLocalizedLayer
} from "../../actions";
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
                                                        <button
                                                            title='Remove'
                                                            objtitle={layer.values_.title}
                                                            disabled={layer.values_.title === 'OpenStreetMap'}
                                                            onClick={e => {
                                                                const element = e.currentTarget;
                                                                const title = element.getAttribute('objtitle');
                                                                handleRemove(title);
                                                            }}
                                                        >{svg.remove}</button>
                                                        <button
                                                            title='GoTo'
                                                            objtitle={layer.values_.title}
                                                            disabled={layer.values_.title === 'OpenStreetMap'}
                                                            onClick={e => {
                                                                const element = e.currentTarget;
                                                                const title = element.getAttribute('objtitle');
                                                                handleGoTo(title);
                                                            }}
                                                        >{svg.goto}</button>
                                                        <button
                                                            title='Update localization'
                                                            objtitle={layer.values_.title}
                                                            disabled={layer.values_.title === 'OpenStreetMap'}
                                                            onClick={e => {
                                                                const element = e.currentTarget;
                                                                const title = element.getAttribute('objtitle');
                                                                handleAddLocal(title);
                                                            }}
                                                        >{svg.lang}</button>
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
                                                </li>
                                            )}
                                        </Draggable>
                                    );
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