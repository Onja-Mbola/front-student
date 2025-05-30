import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    Button,
    IconButton,
    Tooltip,
    useMediaQuery,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useAuth} from "../context/AuthContext";
import {useNavigate, useLocation} from "react-router-dom";
import {useThemeMode} from "../context/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import {useState} from "react";

const drawerWidth = 240;

const menuItems = {
    ADMIN: [
        {label: "Utilisateurs", path: "/admin"},
        {label: "Cours", path: "/courses"},
        {label: "Notes", path: "/notes"},
        {label: "Statistiques", path: "/stats"},
        {label: "Contact", path: "/contact"},
    ],
    SCOLARITE: [
        {label: "Étudiants", path: "/scolarite"},
        {label: "Cours", path: "/courses"},
        {label: "Notes", path: "/notes"},
        {label: "Statistiques", path: "/stats"},
        {label: "Contact", path: "/contact"},
    ],
    STUDENT: [
        {label: "Mes Notes & Statistiques", path: "/student"},
        {label: "Contact Scolarité", path: "/contact"},
    ],
};

function DashboardLayout({children}) {
    const {logout, user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {mode, toggleMode} = useThemeMode();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const drawerContent = (
        <>
            <Toolbar/>
            <Box sx={{overflow: "auto"}}>
                <List>
                    {menuItems[user?.role]?.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }}
                                selected={location.pathname === item.path}
                            >
                                <ListItemText primary={item.label}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </>
    );

    return (
        <Box sx={{display: "flex"}}>
            {/* Top AppBar */}
            <AppBar position="fixed" sx={{zIndex: 1201}}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            sx={{mr: 2}}
                            aria-label="Ouvrir le menu"
                        >
                            <MenuIcon/>
                        </IconButton>
                    )}

                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {user?.role && `Tableau de bord — ${user.role}`}
                    </Typography>

                    <Tooltip
                        title={
                            mode === "light"
                                ? "Passer en mode sombre"
                                : "Passer en mode clair"
                        }
                    >
                        <IconButton
                            onClick={toggleMode}
                            color="inherit"
                            aria-label="Changer le thème"
                        >
                            {mode === "light" ? <DarkModeIcon/> : <LightModeIcon/>}
                        </IconButton>
                    </Tooltip>

                    <Button color="inherit" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Drawer latéral */}
            <Box
                component="nav"
                sx={{width: {md: drawerWidth}, flexShrink: {md: 0}}}
                aria-label="Menu latéral"
            >
                <Drawer
                    variant={isMobile ? "temporary" : "permanent"}
                    open={isMobile ? mobileOpen : true}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{keepMounted: true}}
                    sx={{
                        display: {xs: "block", md: "block"},
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Contenu principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: "background.default",
                    color: "text.primary",
                    p: 3,
                    mt: 8,
                    pl: {md: `${drawerWidth}px`},
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    minHeight: "100vh",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default DashboardLayout;
