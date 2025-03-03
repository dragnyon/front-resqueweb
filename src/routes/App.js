import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // 🔹 Import React Query
import AuthProvider from "../context/AuthContext";
import MainRoutes from "./MainRoutes";

// 🔹 Création du client React Query
const queryClient = new QueryClient();

function App() {
    return (
        <Router>
            <AuthProvider>
                <QueryClientProvider client={queryClient}> {/* 🔹 Ajout du Provider */}
                    <MainRoutes />
                </QueryClientProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
