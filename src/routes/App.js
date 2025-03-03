import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // 🔹 Import React Query
import AuthProvider from "../context/AuthContext";
import MainRoutes from "./MainRoutes";
import ThemeProviderWrapper from "../context/ThemeContext";

// 🔹 Création du client React Query
const queryClient = new QueryClient();

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProviderWrapper>
                <QueryClientProvider client={queryClient}> {/* 🔹 Ajout du Provider */}
                    <MainRoutes />
                </QueryClientProvider>
                </ThemeProviderWrapper>
            </AuthProvider>
        </Router>
    );
}

export default App;
