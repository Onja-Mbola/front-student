import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import Login from "./auth/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ScolariteDashboard from "./pages/ScolariteDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import CoursesPage from "./pages/CoursesPage";
import GradesPage from "./pages/GradesPage";
import StatsPage from "./pages/StatsPage";
import EmailPage from "./pages/EmailPage.jsx";
import LoginRegister from "./pages/LoginRegister.jsx";

function App({theme}) {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginRegister/>}/>
                    <Route path="/admin"
                           element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard/></ProtectedRoute>}/>
                    <Route path="/scolarite" element={<ProtectedRoute allowedRoles={["SCOLARITE"]}><ScolariteDashboard/></ProtectedRoute>}/>
                    <Route path="/courses" element={<ProtectedRoute allowedRoles={["ADMIN", "SCOLARITE"]}><CoursesPage/></ProtectedRoute>}/>
                    <Route path="/notes" element={<ProtectedRoute
                        allowedRoles={["ADMIN", "SCOLARITE"]}><GradesPage/></ProtectedRoute>}/>
                    <Route path="/student"
                           element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentDashboard/></ProtectedRoute>}/>
                    <Route path="/stats" element={<ProtectedRoute
                        allowedRoles={["ADMIN", "SCOLARITE"]}><StatsPage/></ProtectedRoute>}/>
                    <Route
                        path="/contact"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN", "SCOLARITE", "STUDENT"]}>
                                <EmailPage/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
