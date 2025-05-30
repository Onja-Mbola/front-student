import {
    Box,
    Button,
    TextField,
    Stack,
    Typography,
    IconButton,
    Paper,
    Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UserFormDialog from "./UserFormDialog";

function StudentsTable() {
    const [students, setStudents] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/user", {
                params: {
                    page: page + 1,
                    limit: pageSize,
                    role: "STUDENT",
                    keyword: keyword || undefined,
                },
            });
            setStudents(res.data.users);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error("Erreur chargement étudiants :", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page, pageSize, keyword]);

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cet étudiant ?")) return;
        try {
            await axios.delete(`/user/${id}`);
            fetchStudents();
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const columns = [
        {
            field: "id",
            headerName: "Matricule",
            width: 150,
            headerClassName: "header-cell",
            cellClassName: "body-cell",
        },
        {
            field: "firstName",
            headerName: "Prénom",
            flex: 1,
            headerClassName: "header-cell",
            cellClassName: "body-cell",
        },
        {
            field: "lastName",
            headerName: "Nom",
            flex: 1,
            headerClassName: "header-cell",
            cellClassName: "body-cell",
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.5,
            headerClassName: "header-cell",
            cellClassName: "body-cell",
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton
                        color="primary"
                        onClick={() => {
                            setSelectedStudent(params.row);
                            setDialogOpen(true);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                Liste des étudiants
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
                <TextField
                    label="Rechercher un étudiant"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setSelectedStudent(null);
                        setDialogOpen(true);
                    }}
                >
                    Ajouter un étudiant
                </Button>
            </Stack>

            <Box sx={{ height: 520, borderRadius: 3, overflow: "hidden" }}>
                <DataGrid
                    rows={students}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pagination
                    page={page}
                    pageSize={pageSize}
                    rowCount={pagination?.totalDocuments || 0}
                    paginationMode="server"
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setPage(0);
                    }}
                    loading={loading}
                    sx={(theme) => ({
                        "& .header-cell": {
                            backgroundColor:
                                theme.palette.mode === "dark" ? theme.palette.grey[900] : "#e3f2fd",
                            color:
                                theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
                            fontWeight: "bold",
                            fontSize: 16,
                        },
                        "& .body-cell": {
                            fontSize: 15,
                        },
                        border: "1px solid #ccc",
                        borderRadius: 2,
                    })}

                />
            </Box>

            <UserFormDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                user={selectedStudent}
                onSaved={fetchStudents}
                forceRole="STUDENT"
            />
        </Paper>
    );
}

export default StudentsTable;
