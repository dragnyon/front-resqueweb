import './App.css';

import PrivateRoute from "./features/components/PrivateRoute";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard/*" element={<DashboardPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
