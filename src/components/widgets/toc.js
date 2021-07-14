import { Button } from "react-bootstrap";
import {
    DragDropContext,
    Droppable,
    Draggable
} from 'react-beautiful-dnd';
import {
    useSelector,
    useDispatch
} from 'react-redux';
import {
    setLayers,
    hideTOC,
    triggerChange
} from '../../actions';
import { useEffect } from "react";
const TOC = () => {
    const activeLayers = useSelector(state => state.toc.activeLayers);
    const trigger = useSelector(state => state.toc.comonentChanged);
    const dispatch = useDispatch();
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const [reorderedItem] = activeLayers.splice(result.source.index, 1);
        activeLayers.splice(result.destination.index, 0, reorderedItem);
        dispatch(setLayers(activeLayers));
        dispatch(triggerChange());
    };
    const handleDismiss = () => {
        dispatch(hideTOC());
    };
    const handleVisibility = (title) => {
        if (activeLayers) {
            activeLayers.forEach(layer => {
                if (layer.values_.title === title) {
                    layer.values_.visible = !layer.values_.visible
                }
            });
            dispatch(setLayers(activeLayers));
            dispatch(triggerChange());
        }
    };
    const handleRemove = (title) => {
        let remainingLayers = activeLayers.filter(layer => layer.values_.title !== title);
        dispatch(setLayers(remainingLayers));
    };
    useEffect(() => { }, [trigger]);
    return (
        <div className="toc">
            <div id="toc-body">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="toc-list">
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef} className="container">
                                {activeLayers && activeLayers.map((layer, index) => {
                                    return (
                                        <Draggable key={layer.values_.title} index={index} draggableId={layer.values_.title}>
                                            {(provided) => (
                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <input
                                                        type="checkbox"
                                                        checked={layer.values_.visible}
                                                        id={`check${layer.values_.title}`}
                                                        title={layer.values_.title}
                                                        onChange={(e) => {
                                                            let element = e.target;
                                                            let title = element.getAttribute('title');
                                                            handleVisibility(title);
                                                        }}
                                                    />
                                                    {layer.values_.title}
                                                    <button
                                                        title={layer.values_.title}
                                                        disabled={layer.values_.title === 'OpenStreetMap'}
                                                        onClick={(e) => {
                                                            let element = e.target;
                                                            let title = element.getAttribute('title');
                                                            handleRemove(title);
                                                        }}
                                                    >Remove</button>
                                                </li>
                                            )}
                                        </Draggable>
                                    );
                                }
                                )}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <div className="col text-center" id="toc-buttons">
                <Button variant="warning" onClick={handleDismiss}>
                    Dismiss
                </Button>
            </div>
        </div>
    );
};
export default TOC;