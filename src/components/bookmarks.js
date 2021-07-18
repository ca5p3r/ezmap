import {
    Form,
    Button
} from "react-bootstrap";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    triggerBookmarks,
    addBookmark,
    removeAllBookmarks,
    removeBookmark,
    setMapZoom,
    setMapCenter,
    triggerShowToast,
    setMessage,
    setToastColor
} from "../actions";
import { useState } from "react";
const Bookmarks = () => {
    const [title, setTitle] = useState('');
    const mapinfo = useSelector(state => state.mapInfo);
    const bookmarksList = useSelector(state => state.bookmarks.list);
    const dispatch = useDispatch();
    const handleDismiss = () => {
        dispatch(triggerBookmarks());
    };
    const handleSave = () => {
        if (title) {
            const myObj = {
                center: mapinfo.mapCenter,
                zoom: mapinfo.mapZoom,
                title
            };
            dispatch(addBookmark(myObj));
            setTitle('');
            dispatch(setToastColor('success'));
            dispatch(setMessage({
                title: 'Success',
                message: 'Bookmark saved!'
            }));
            dispatch(triggerShowToast(true));
        }
        else {
            dispatch(setToastColor('warning'));
            dispatch(setMessage({
                title: 'Warning',
                message: 'Please enter bookmark title!'
            }));
            dispatch(triggerShowToast(true));
        };
    };
    const handleRemoveAll = () => {
        dispatch(removeAllBookmarks());
        dispatch(setToastColor('info'));
        dispatch(setMessage({
            title: 'Notice',
            message: 'All bookmarks are deleted!'
        }));
        dispatch(triggerShowToast(true));
    };
    const handleRemove = () => {
        let item = document.getElementById('formBasicDropdown').value;
        if (item && item !== 'Selector') {
            dispatch(removeBookmark(item));
            dispatch(setToastColor('info'));
            dispatch(setMessage({
                title: 'Notice',
                message: 'Bookmark is deleted!'
            }));
            dispatch(triggerShowToast(true));
        }
        else {
            dispatch(setToastColor('warning'));
            dispatch(setMessage({
                title: 'Warning',
                message: 'Please select a bookmark first!'
            }));
            dispatch(triggerShowToast(true));
        };
    };
    const handleLoad = () => {
        let selectedBookmark = document.getElementById('formBasicDropdown').value;
        let selectedElement = document.getElementById(`option${selectedBookmark}`);
        let centerx = Number(selectedElement.getAttribute('center').split(',')[0]);
        let centery = Number(selectedElement.getAttribute('center').split(',')[1]);
        let zoom = Number(selectedElement.getAttribute('zoom'));
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
                <Form.Group controlId="formBasicDropdown">
                    <Form.Label>Select a bookmark</Form.Label>
                    <Form.Control as="select">
                        <option id="optionSelector" value="Selector" center="0,0" zoom="0">Select</option>
                        {bookmarksList.map(
                            (bookmark, key) => {
                                return <option id={`option${bookmark.title}`} key={key} value={bookmark.title} center={bookmark.center} zoom={bookmark.zoom}>{bookmark.title}</option>;
                            }
                        )}
                    </Form.Control>
                </Form.Group>
                <div className="col text-center">
                    <Button variant="warning" onClick={handleDismiss}>
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
                    <Button variant="success" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
};
export default Bookmarks;