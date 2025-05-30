import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CourseFormDialog from "./CourseFormDialog";

function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const theme = useTheme();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/course");
      setCourses(res.data);
    } catch (err) {
      console.error("Erreur chargement cours :", err);
      setSnackbar({
        open: true,
        message: "❌ Erreur chargement cours",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce cours ?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`/course/${id}`);
      setSnackbar({
        open: true,
        message: "✅ Cours supprimé",
        severity: "success",
      });
      fetchCourses();
    } catch (err) {
      console.error("Erreur suppression :", err);
      setSnackbar({
        open: true,
        message: "❌ Échec suppression",
        severity: "error",
      });
    }
  };

  const handleOpenDialog = (course = null) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCourse(null);
  };

  const columns = [
    { field: "name", headerName: "Nom du cours", flex: 1 },
    { field: "code", headerName: "Code", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => handleOpenDialog(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box px={3} pt={3}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        fontWeight="bold"
      >
        📚 Gestion des cours
      </Typography>

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Ajouter un cours
        </Button>
      </Stack>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ height: 450 }}>
            <DataGrid
              rows={courses}
              columns={columns}
              getRowId={(row) => row._id}
              loading={loading}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: theme.palette.grey[100],
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <CourseFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        course={selectedCourse}
        onSaved={() => {
          fetchCourses();
          setSnackbar({
            open: true,
            message: "✅ Cours enregistré",
            severity: "success",
          });
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CoursesTable;
