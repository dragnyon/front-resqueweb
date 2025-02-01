import UsersPage from "./UsersPage";
import EntreprisesPage from "./EntreprisePage";

function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>
            <div style={{ display: "flex", gap: "20px" }}>
                <UsersPage />
                <EntreprisesPage />
            </div>
        </div>
    );
}

export default DashboardPage;
