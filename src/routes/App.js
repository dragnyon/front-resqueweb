import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import MainRoutes from "./MainRoutes";

function App() {
    return (
        <Router>
            <AuthProvider>
                <MainRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
