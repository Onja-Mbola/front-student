import DashboardLayout from "../components/DashboardLayout";
import AdminStats from "../components/AdminStats";
import { useAuth } from "../context/AuthContext";
import ScolariteStats from "../components/ScolariteStats.jsx";

function StatsPage() {
    const { user } = useAuth();

    return (
        <DashboardLayout>
            {user?.role === "ADMIN" && <AdminStats />}
            {user?.role === "SCOLARITE" && <ScolariteStats />}
        </DashboardLayout>
    );
}

export default StatsPage;
