import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderWithMode } from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '207771219867-up2r2hjsv1k5jfu41la5f4bs9kg0r22p.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ThemeProviderWithMode>
                {(theme) => (
                    <AuthProvider>
                        <CssBaseline />
                        <App theme={theme} />
                    </AuthProvider>
                )}
            </ThemeProviderWithMode>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
