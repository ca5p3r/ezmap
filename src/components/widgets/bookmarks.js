import {
    Form,
    Button
} from "react-bootstrap";
import { useState } from "react";
const Bookmarks = (props) => {
    const [title, setTitle] = useState('');
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
                        {props.bookmarksList.map(
                            (bookmark, key) => {
                                return <option id={`option${bookmark.title}`} key={key} value={bookmark.title} center={bookmark.center} zoom={bookmark.zoom}>{bookmark.title}</option>;
                            }
                        )}
                    </Form.Control>
                </Form.Group>
                <div className="col text-center">
                    <Button variant="warning" onClick={props.handleDismiss}>
                        Dismiss
                    </Button>
                    <Button variant="danger" onClick={props.handleRemoveAll}>
                        Remove all
                    </Button>
                    <Button variant="danger" onClick={props.handleRemove}>
                        Remove
                    </Button>
                    <Button variant="secondary" onClick={props.handleLoad}>
                        Load
                    </Button>
                    <Button variant="success" onClick={() => props.handleSave(title)}>
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
};
export default Bookmarks;