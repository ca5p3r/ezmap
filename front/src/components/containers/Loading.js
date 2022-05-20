import { useSelector } from "react-redux";

const Loading = () => {
    const isLoading = useSelector(state => state.mapInfo.isLoading);
    return (
        <div className="overlay" style={{ display: isLoading ? 'block' : 'none' }}>
            <div className="spinner-grow text-info" style={{ width: "6rem", height: "6rem", position: "absolute", bottom: "25rem", left: "54rem", zIndex: "2000" }} role="status" >
                <span className="visually-hidden"></span>
            </div>
        </div>
    );
};
export default Loading;