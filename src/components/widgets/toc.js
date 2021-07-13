import { Button } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { setLayers, hideTOC, orderOn } from '../../actions'

const TOC = () => {
    const activeLayers = useSelector(state => state.toc.activeLayers);
    console.log(activeLayers);
    const dispatch = useDispatch();

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const [reorderedItem] = activeLayers.splice(result.source.index, 1);
        activeLayers.splice(result.destination.index, 0, reorderedItem);
        dispatch(setLayers(activeLayers));
        dispatch(orderOn());
    };
    const handleDismiss = () => {
        dispatch(hideTOC());
    };
    return (
        <div className="toc">
            <div id="toc-body">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="toc-list">
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef}>
                                {activeLayers && activeLayers.map((layer, index) => {
                                    return (
                                        <Draggable key={layer.values_.title} index={index} draggableId={layer.values_.title}>
                                            {(provided) => (
                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{layer.values_.title}</li>
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
}

export default TOC;