import {
    Form,
    Button
} from "react-bootstrap";
import { useState } from "react";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    triggerBookmarks,
    addBookmark,
    removeAllBookmarks,
    removeBookmark,
    triggerToast,
    setMapCenter,
    setMapZoom
} from "../../actions";
const Bookmarks = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const bookmarks = useSelector(state => state.bookmarks.list);
    const mapInfo = useSelector(state => state.mapInfo);
    const handleSave = (title) => {
        if (title) {
            const myObj = {
                center: mapInfo.mapCenter,
                zoom: mapInfo.mapZoom,
                title
            };
            dispatch(addBookmark(myObj));
            dispatch(triggerToast({
                title: 'Success',
                message: 'Bookmark saved!',
                visible: true
            }));
        }
        else {
            dispatch(triggerToast({
                title: 'Warning',
                message: 'Please enter bookmark title!',
                visible: true
            }));
        };
    };
    const handleRemoveAll = () => {
        dispatch(removeAllBookmarks());
        dispatch(triggerToast({
            title: 'Info',
            message: 'All bookmarks are deleted!',
            visible: true
        }));
    };
    const handleRemove = () => {
        const item = document.getElementById('bookmarks-dropdown').value;
        if (item && item !== 'Selector') {
            dispatch(removeBookmark(item));
            dispatch(triggerToast({
                title: 'Info',
                message: 'Bookmark is deleted!',
                visible: true
            }));
        }
        else {
            dispatch(triggerToast({
                title: 'Warning',
                message: 'Please select a bookmark first!',
                visible: true
            }));
        };
    };
    const handleLoad = () => {
        const selectedBookmark = document.getElementById('bookmarks-dropdown').value;
        const selectedElement = document.getElementById(`option${selectedBookmark}`);
        const centerx = Number(selectedElement.getAttribute('center').split(',')[0]);
        const centery = Number(selectedElement.getAttribute('center').split(',')[1]);
        const zoom = Number(selectedElement.getAttribute('zoom'));
        dispatch(setMapZoom(zoom));
        dispatch(setMapCenter([centerx, centery]));
    };
    return (
        <div className="bookmarks">
            <Form>
                <h2>Bookmarks</h2>
                <Form.Group controlId="bookmarktitle">
                    <Form.Label>Bookmark title</Form.Label>
                    <Form.Control type="text" placeholder="Enter a title:" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="bookmarks-dropdown">
                    <Form.Label>Select a bookmark</Form.Label>
                    <Form.Control as="select">
                        <option id="optionSelector" value="Selector" center="0,0" zoom="0">Select</option>
                        {bookmarks.map(
                            (bookmark, key) => {
                                return <option id={`option${bookmark.title}`} key={key} value={bookmark.title} center={bookmark.center} zoom={bookmark.zoom}>{bookmark.title}</option>;
                            }
                        )}
                    </Form.Control>
                </Form.Group>
                <div className="col text-center">
                    <Button variant="warning" onClick={() => dispatch(triggerBookmarks())}>
                        Dismiss
                    </Button>
                    <Button variant="danger" onClick={handleRemoveAll}>
                        Remove all
                    </Button>
                    <Button variant="danger" onClick={handleRemove}>
                        Remove
                    </Button>
                    <Button variant="secondary" onClick={handleLoad}>
                        Load
                    </Button>
                    <Button variant="success" onClick={() => handleSave(title)}>
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
};
export default Bookmarks;