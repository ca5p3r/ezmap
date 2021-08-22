const Loading = () => {
    return (
        <div className="spinner-grow text-info" style={{ width: "6rem", height: "6rem", position: "absolute", bottom: "25rem", left: "54rem", zIndex: "2000" }} role="status" >
            <span className="visually-hidden"></span>
        </div>
    );
};
export default Loading;