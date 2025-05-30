import {
    Box,
    Typography,
    Button,
    IconButton,
    Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GradeFormDialog from "./GradeFormDialog";

function GradesTable() {
    const [grades, setGrades] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [page, setPage] = useState(0);

    const fetchGrades = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/grade?page=${page + 1}`);

            // Transformation des données
            const rows = res.data.grades.map((g) => ({
                ...g,
                studentName: g.student
                    ? `${g.student.firstName} ${g.student.lastName}`
                    : "Étudiant inconnu",
                courseName: g.course?.name || "Cours inconnu",
                formattedDate: g.date
                    ? new Date(g.date).toLocaleDateString()
                    : "N/A",
            }));

            setGrades(rows);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error("Erreur lors du chargement des notes :", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrades();
    }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette note ?")) return;
        try {
            await axios.delete(`/grade/${id}`);
            fetchGrades();
        } catch (err) {
            alert("Erreur lors de la suppression : " + err.message);
        }
    };

    const columns = [
        { field: "studentName", headerName: "Étudiant", flex: 1 },
        { field: "courseName", headerName: "Cours", flex: 1 },
        { field: "grade", headerName: "Note", flex: 0.5 },
        { field: "formattedDate", headerName: "Date", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        onClick={() => {
                            setSelectedGrade(params.row);
                            setDialogOpen(true);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Gestion des notes
            </Typography>

            <Stack direction="row" justifyContent="flex-end" mb={2}>
                <Button
                    variant="contained"
                    onClick={() => {
                        setSelectedGrade(null);
                        setDialogOpen(true);
                    }}
                >
                    Ajouter une note
                </Button>
            </Stack>

            <div style={{ height: "100%" }}>
                <DataGrid
                    rows={grades}
                    columns={columns}
                    getRowId={(row) => row._id}
                    rowCount={pagination?.totalDocuments || 0}
                    pageSizeOptions={[10]}
                    paginationModel={{ page, pageSize: 10 }}
                    paginationMode="server"
                    onPaginationModelChange={(model) => setPage(model.page)}
                    loading={loading}
                />
            </div>

            <GradeFormDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                grade={selectedGrade}
                onSaved={fetchGrades}
            />
        </Box>
    );
}

export default GradesTable;
