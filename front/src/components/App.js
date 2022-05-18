import AppContainer from "./AppContainer";
import Navbar from "./widgets/AppNavBar";
import { useSelector } from "react-redux";
import LandingPage from "./containers/LandingPage";
import Loading from "./containers/Loading";
import MyToast from "./containers/MyToast";
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";

function App() {
  const login = useSelector(state => state.login.isLogged);
  const isLoading = useSelector(state => state.mapInfo.isLoading);
  return (
    <div id="app">
      <LoginModal />
      <RegisterModal />
      <Navbar />
      {isLoading && <Loading />}
      {login ? <AppContainer /> : <LandingPage />}
      <MyToast />
    </div>
  );
}
export default App;
