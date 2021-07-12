import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { hideBookmarks } from "../../actions";

const Bookmarks = () => {
    const bookmarksState = useSelector(state => state.bookmarks);
    const bookmarksList = bookmarksState.list;
    const dispatch = useDispatch();

    const handleDismiss = () => {
        dispatch(hideBookmarks());
    }

    return (
        <div className="bookmarks">
            <Form>
                <Form.Group controlId="formBasicTitle">
                    <h2>Bookmarks</h2>
                    <Form.Label>Bookmark title</Form.Label>
                    <Form.Control type="text" placeholder="Enter a title:" />
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
                    <Button variant="danger">
                        Remove all
                    </Button>
                    <Button variant="danger">
                        Remove
                    </Button>
                    <Button variant="secondary">
                        Load
                    </Button>
                    <Button variant="success">
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default Bookmarks;