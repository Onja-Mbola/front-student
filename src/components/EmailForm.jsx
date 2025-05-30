import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Collapse,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function EmailForm() {
  const form = useRef();
  const [success, setSuccess] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setSuccess(null);

    emailjs
      .sendForm(
        "service_a8fwcdy",
        "template_0238rq2",
        form.current,
        "b3bNO5cS_qTWR0MfF"
      )
      .then(() => {
        setSuccess("success");
        form.current.reset();
      })
      .catch((error) => {
        setSuccess("error");
        console.error("Erreur EmailJS :", error);
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "relative",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 1000,
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            ✉️ Envoyer un message
          </Typography>

          <Collapse in={success === "success"}>
            <Alert severity="success" sx={{ mb: 2 }}>
              E-mail envoyé avec succès !
            </Alert>
          </Collapse>
          <Collapse in={success === "error"}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Une erreur est survenue. Veuillez réessayer.
            </Alert>
          </Collapse>

          <Box component="form" ref={form} onSubmit={sendEmail}>
            <TextField
              name="name"
              label="Nom"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="message"
              label="Message"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              endIcon={<SendIcon />}
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 3,
                transition: "0.3s",
                ":hover": {
                  backgroundColor: "primary.dark",
                  transform: "scale(1.02)",
                },
              }}
            >
              Envoyer
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EmailForm;
