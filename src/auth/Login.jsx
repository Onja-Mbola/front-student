import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  useTheme
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const GradientContainer = styled(Container)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f0f2f5 0%, #d6e4f0 100%)"
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: "20px",
  boxShadow: theme.shadows[8],
  width: "100%",
  maxWidth: "450px",
  backgroundColor: theme.palette.background.paper
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.2s ease-in-out'
  },
  '& .MuiOutlinedInput-root:hover': {
    boxShadow: '0 0 0 2px #90caf9'
  }
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      login(res.data.token);
      const role = res.data.user.role;
      if (role === "ADMIN") navigate("/admin");
      else if (role === "SCOLARITE") navigate("/scolarite");
      else navigate("/student");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur de connexion");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("/auth/google-login", {
        token: credentialResponse.credential
      });
      login(res.data.token);
      const role = res.data.user.role;
      if (role === "ADMIN") navigate("/admin");
      else if (role === "SCOLARITE") navigate("/scolarite");
      else navigate("/student");
    } catch (err) {
      console.error("Google login failed", err);
      alert("Échec de la connexion avec Google");
    }
  };

  return (
    <GradientContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
          Connexion
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <StyledTextField
            label="Adresse e-mail"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <StyledTextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 3, borderRadius: "12px", padding: "12px 0", fontWeight: "bold" }}
          >
            Se connecter
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>Ou</Divider>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Erreur de connexion Google")}
          />
        </Box>
      </StyledPaper>
    </GradientContainer>
  );
}

export default Login;
