import { createContext, useContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProviderWithMode = ({ children }) => {
    const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light");

    const toggleMode = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("theme", newMode);
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: mode === "dark" ? "#90caf9" : "#1976d2",
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleMode }}>
            {children(theme)}
        </ThemeContext.Provider>
    );
};
