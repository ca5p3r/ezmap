import { Button } from "react-bootstrap";
import {
    DragDropContext,
    Droppable,
    Draggable
} from 'react-beautiful-dnd';
import { useEffect } from "react";
const TOC = (props) => {
    useEffect(() => { }, [props.trigger]);
    return (
        <div className="toc">
            <div id="toc-body">
                <h2>Table of contents</h2>
                <DragDropContext onDragEnd={props.handleOnDragEnd}>
                    <Droppable droppableId="toc-list">
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef} className="container">
                                {props.activeLayers && props.activeLayers.map((layer, index) => {
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
                                                            props.handleVisibility(title);
                                                        }}
                                                    />
                                                    {layer.values_.title.split('&')[0]}
                                                    <button
                                                        title='Remove'
                                                        objtitle={layer.values_.title}
                                                        disabled={layer.values_.title === 'OpenStreetMap'}
                                                        onClick={(e) => {
                                                            let element = e.currentTarget;
                                                            let title = element.getAttribute('objtitle');
                                                            props.handleRemove(title);
                                                        }}
                                                    ><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" className="svg-inline--fa fa-trash fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg></button>
                                                    <button
                                                        title='GoTo'
                                                        objtitle={layer.values_.title}
                                                        disabled={layer.values_.title === 'OpenStreetMap'}
                                                        onClick={(e) => {
                                                            let element = e.currentTarget;
                                                            let title = element.getAttribute('objtitle');
                                                            props.handleGoTo(title);
                                                        }}
                                                    ><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search-location" className="svg-inline--fa fa-search-location fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505.04 442.66l-99.71-99.69c-4.5-4.5-10.6-7-17-7h-16.3c27.6-35.3 44-79.69 44-127.99C416.03 93.09 322.92 0 208.02 0S0 93.09 0 207.98s93.11 207.98 208.02 207.98c48.3 0 92.71-16.4 128.01-44v16.3c0 6.4 2.5 12.5 7 17l99.71 99.69c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.59.1-33.99zm-297.02-90.7c-79.54 0-144-64.34-144-143.98 0-79.53 64.35-143.98 144-143.98 79.54 0 144 64.34 144 143.98 0 79.53-64.35 143.98-144 143.98zm.02-239.96c-40.78 0-73.84 33.05-73.84 73.83 0 32.96 48.26 93.05 66.75 114.86a9.24 9.24 0 0 0 14.18 0c18.49-21.81 66.75-81.89 66.75-114.86 0-40.78-33.06-73.83-73.84-73.83zm0 96c-13.26 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"></path></svg></button>
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
                <Button variant="warning" onClick={props.handleDismiss}>
                    Dismiss
                </Button>
            </div>
        </div>
    );
};
export default TOC;