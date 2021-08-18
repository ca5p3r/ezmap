import { Button } from "react-bootstrap";
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
const TOC = () => {
    const dispatch = useDispatch();
    const tocInfo = useSelector(state => state.toc);
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const [reorderedItem] = tocInfo.activeLayers.splice(result.source.index, 1);
        tocInfo.activeLayers.splice(result.destination.index, 0, reorderedItem);
        dispatch(setActiveLayers(tocInfo.activeLayers));
        dispatch(triggerTOCChange(true));
    };
    const handleVisibility = (title) => {
        tocInfo.activeLayers.forEach(layer => {
            if (layer.values_.title === title) {
                layer.values_.visible = !layer.values_.visible
            }
        });
        dispatch(setActiveLayers(tocInfo.activeLayers));
        dispatch(triggerTOCChange(true));
    };
    const handleRemove = (title) => {
        const remainingLayers = tocInfo.activeLayers.filter(layer => layer.values_.title !== title);
        const tocRemainingLayers = tocInfo.historicalData.filter(item => item.id !== title.split('&')[1]);
        dispatch(setActiveLayers(remainingLayers));
        dispatch(setHistoricalLayers(tocRemainingLayers));
    };
    const handleGoTo = (title) => {
        const uniqueID = title.split('&')[1];
        const newExtent = (tocInfo.historicalData.filter(item => item.id === uniqueID))[0].extent;
        dispatch(setMapExtent(newExtent));
    };
    const handleAddLocal = (title) => {
        dispatch(triggerShowLocalization(true));
        dispatch(triggerShowTOC());
        dispatch(setLocalizedLayer(title.split('&')[1]));
    };
    return (
        <div className="toc">
            <div id="toc-body">
                <h2>Table of contents</h2>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="toc-list">
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef} className="container">
                                {tocInfo.activeLayers && tocInfo.activeLayers.map((layer, index) => {
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
                                                            const element = e.target;
                                                            const title = element.getAttribute('title');
                                                            handleVisibility(title);
                                                        }}
                                                    />
                                                    {layer.values_.title.split('&')[0]}
                                                    <button
                                                        title='Remove'
                                                        objtitle={layer.values_.title}
                                                        disabled={layer.values_.title === 'OpenStreetMap'}
                                                        onClick={(e) => {
                                                            const element = e.currentTarget;
                                                            const title = element.getAttribute('objtitle');
                                                            handleRemove(title);
                                                        }}
                                                    ><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" className="svg-inline--fa fa-trash fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg></button>
                                                    <button
                                                        title='GoTo'
                                                        objtitle={layer.values_.title}
                                                        disabled={layer.values_.title === 'OpenStreetMap'}
                                                        onClick={(e) => {
                                                            const element = e.currentTarget;
                                                            const title = element.getAttribute('objtitle');
                                                            handleGoTo(title);
                                                        }}
                                                    ><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search-location" className="svg-inline--fa fa-search-location fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505.04 442.66l-99.71-99.69c-4.5-4.5-10.6-7-17-7h-16.3c27.6-35.3 44-79.69 44-127.99C416.03 93.09 322.92 0 208.02 0S0 93.09 0 207.98s93.11 207.98 208.02 207.98c48.3 0 92.71-16.4 128.01-44v16.3c0 6.4 2.5 12.5 7 17l99.71 99.69c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.59.1-33.99zm-297.02-90.7c-79.54 0-144-64.34-144-143.98 0-79.53 64.35-143.98 144-143.98 79.54 0 144 64.34 144 143.98 0 79.53-64.35 143.98-144 143.98zm.02-239.96c-40.78 0-73.84 33.05-73.84 73.83 0 32.96 48.26 93.05 66.75 114.86a9.24 9.24 0 0 0 14.18 0c18.49-21.81 66.75-81.89 66.75-114.86 0-40.78-33.06-73.83-73.84-73.83zm0 96c-13.26 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"></path></svg></button>
                                                    <button
                                                        title='Update localization'
                                                        objtitle={layer.values_.title}
                                                        disabled={layer.values_.title === 'OpenStreetMap'}
                                                        onClick={(e) => {
                                                            const element = e.currentTarget;
                                                            const title = element.getAttribute('objtitle');
                                                            handleAddLocal(title);
                                                        }}
                                                    ><svg width="25" height="25" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="language" className="svg-inline--fa fa-language fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M152.1 236.2c-3.5-12.1-7.8-33.2-7.8-33.2h-.5s-4.3 21.1-7.8 33.2l-11.1 37.5H163zM616 96H336v320h280c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24zm-24 120c0 6.6-5.4 12-12 12h-11.4c-6.9 23.6-21.7 47.4-42.7 69.9 8.4 6.4 17.1 12.5 26.1 18 5.5 3.4 7.3 10.5 4.1 16.2l-7.9 13.9c-3.4 5.9-10.9 7.8-16.7 4.3-12.6-7.8-24.5-16.1-35.4-24.9-10.9 8.7-22.7 17.1-35.4 24.9-5.8 3.5-13.3 1.6-16.7-4.3l-7.9-13.9c-3.2-5.6-1.4-12.8 4.2-16.2 9.3-5.7 18-11.7 26.1-18-7.9-8.4-14.9-17-21-25.7-4-5.7-2.2-13.6 3.7-17.1l6.5-3.9 7.3-4.3c5.4-3.2 12.4-1.7 16 3.4 5 7 10.8 14 17.4 20.9 13.5-14.2 23.8-28.9 30-43.2H412c-6.6 0-12-5.4-12-12v-16c0-6.6 5.4-12 12-12h64v-16c0-6.6 5.4-12 12-12h16c6.6 0 12 5.4 12 12v16h64c6.6 0 12 5.4 12 12zM0 120v272c0 13.3 10.7 24 24 24h280V96H24c-13.3 0-24 10.7-24 24zm58.9 216.1L116.4 167c1.7-4.9 6.2-8.1 11.4-8.1h32.5c5.1 0 9.7 3.3 11.4 8.1l57.5 169.1c2.6 7.8-3.1 15.9-11.4 15.9h-22.9a12 12 0 0 1-11.5-8.6l-9.4-31.9h-60.2l-9.1 31.8c-1.5 5.1-6.2 8.7-11.5 8.7H70.3c-8.2 0-14-8.1-11.4-15.9z"></path></svg></button>
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
                <Button variant="warning" onClick={() => dispatch(triggerShowTOC())}>
                    Dismiss
                </Button>
            </div>
        </div>
    );
};
export default TOC;