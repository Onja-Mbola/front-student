import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import emailjs from '@emailjs/browser';

const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "STUDENT",
};

function UserFormDialog({ open, onClose, user, onSaved }) {
    const isEdit = !!user;
    const [form, setForm] = useState(defaultValues);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: "", // Vide en mode édition
                role: user.role,
            });
        } else {
            setForm(defaultValues);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { firstName, lastName, email, password, role } = form;
        if (!firstName || !lastName || !email || (!isEdit && !password) || !role) {
            alert("Tous les champs sont requis.");
            return;
        }

        setLoading(true);

        try {
            if (isEdit) {
                await axios.put(`/user/${user._id}`, { firstName, lastName, email, role });
            } else {
                await axios.post("/auth/register", {
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                });
            }

            try {
                await emailjs.send(
                    'service_a8fwcdy',      // 👉 Ton service ID
                    'template_0238rq2',     // 👉 Ton template ID
                    {
                        name: firstName + ' ' + lastName,
                        email: email,
                        role: role,
                        message: `Un nouvel étudiant a été ajouté : ${firstName} ${lastName} (${email})`,
                    },
                    'b3bNO5cS_qTWR0MfF'       // 👉 Ta clé publique
                );
            } catch (err) {
                console.error("Erreur lors de l'envoi d'e-mail :", err);
            }

            onSaved?.(); // Rafraîchissement
            onClose();   // Fermeture
        } catch (err) {
            alert("Erreur lors de l'enregistrement : " + err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? "Modifier un utilisateur" : "Créer un utilisateur"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Prénom"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Nom"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    {!isEdit && (
                        <TextField
                            label="Mot de passe"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <TextField
                        label="Rôle"
                        name="role"
                        select
                        value={form.role}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="SCOLARITE">SCOLARITE</MenuItem>
                        <MenuItem value="STUDENT">STUDENT</MenuItem>
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Annuler</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {isEdit ? "Modifier" : "Créer"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserFormDialog;
