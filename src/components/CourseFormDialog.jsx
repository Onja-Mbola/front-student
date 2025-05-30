import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const defaultValues = {
    name: "",
    code: "",
};

function CourseFormDialog({ open, onClose, course, onSaved }) {
    const isEdit = !!course;
    const [form, setForm] = useState(defaultValues);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            setForm({
                name: course.name,
                code: course.code,
            });
        } else {
            setForm(defaultValues);
        }
    }, [course]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { name, code } = form;
        if (!name || !code) {
            alert("Tous les champs sont requis.");
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await axios.put(`/course/${course._id}`, { name, code });
            } else {
                await axios.post("/course", { name, code });
            }
            onSaved?.(); // Recharge les cours
            onClose();   // Ferme la modale
        } catch (err) {
            alert("Erreur : " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? "Modifier le cours" : "Ajouter un cours"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Nom du cours"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Code"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Annuler</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {isEdit ? "Modifier" : "Ajouter"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CourseFormDialog;
