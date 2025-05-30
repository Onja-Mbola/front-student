import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import dayjs from "dayjs";

function GradeFormDialog({ open, onClose, grade, onSaved }) {
    const isEdit = !!grade;
    const [form, setForm] = useState({
        student: "",
        course: "",
        grade: "",
        date: dayjs().format("YYYY-MM-DD"),
    });
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [studentsRes, coursesRes] = await Promise.all([
                    axios.get("/user?role=STUDENT"),
                    axios.get("/course"),
                ]);
                setStudents(studentsRes.data.users || []);
                setCourses(coursesRes.data || []);
            } catch (err) {
                console.error("Erreur lors du chargement des options :", err);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        if (isEdit) {
            setForm({
                student: grade.student?._id || "",
                course: grade.course?._id || "",
                grade: grade.grade || "",
                date: grade.date?.substring(0, 10) || dayjs().format("YYYY-MM-DD"),
            });
        } else {
            setForm({
                student: "",
                course: "",
                grade: "",
                date: dayjs().format("YYYY-MM-DD"),
            });
        }
    }, [grade]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { student, course, grade: note, date } = form;
        if (!student || !course || !note || !date) {
            alert("Tous les champs sont requis.");
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await axios.put(`/grade/${grade._id}`, {
                    student,
                    course,
                    grade: note,
                    date,
                });
            } else {
                await axios.post("/grade", [
                    {
                        student,
                        course,
                        grade: note,
                        date,
                    },
                ]);
            }
            onSaved?.();
            onClose();
        } catch (err) {
            console.error("Erreur formulaire note :", err);
            alert("Erreur : " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? "Modifier une note" : "Ajouter une note"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        select
                        label="Étudiant"
                        name="student"
                        value={form.student}
                        onChange={handleChange}
                        fullWidth
                        required
                    >
                        {students.map((s) => (
                            <MenuItem key={s._id} value={s._id}>
                                {s.firstName} {s.lastName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Cours"
                        name="course"
                        value={form.course}
                        onChange={handleChange}
                        fullWidth
                        required
                    >
                        {courses.map((c) => (
                            <MenuItem key={c._id} value={c._id}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        type="number"
                        label="Note"
                        name="grade"
                        value={form.grade}
                        onChange={handleChange}
                        fullWidth
                        required
                    />

                    <TextField
                        type="date"
                        label="Date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Annuler
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {isEdit ? "Modifier" : "Ajouter"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default GradeFormDialog;
