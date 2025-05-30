import DashboardLayout from "../components/DashboardLayout";
import UsersTable from "../components/UsersTable";

function AdminDashboard() {
    return (
        <DashboardLayout>
            <UsersTable />
        </DashboardLayout>
    );
}

export default AdminDashboard;
