import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UserFormDialog from "./UserFormDialog";

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [roleFilter, setRoleFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/user", {
        params: {
          page: page + 1,
          limit: pageSize,
          role: roleFilter || undefined,
          keyword: keyword || undefined,
        },
      });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Erreur chargement utilisateurs :", err);
      setSnackbar({
        open: true,
        message: "❌ Erreur lors du chargement",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, roleFilter, keyword]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Supprimer cet utilisateur ?");
    if (!confirm) return;

    try {
      await axios.delete(`/user/${id}`);
      fetchUsers();
      setSnackbar({
        open: true,
        message: "✅ Utilisateur supprimé",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "❌ Échec de la suppression",
        severity: "error",
      });
    }
  };

  const handleSearch = () => {
    setPage(0);
    setKeyword(searchTerm.trim());
  };

  const columns = [
    { field: "firstName", headerName: "Prénom", flex: 1 },
    { field: "lastName", headerName: "Nom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "role", headerName: "Rôle", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0.6,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="Modifier utilisateur"
            onClick={() => {
              setSelectedUser(params.row);
              setDialogOpen(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="Supprimer utilisateur"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        👤 Gestion des utilisateurs
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={2}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <TextField
          label="Rechercher"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <TextField
          label="Filtrer par rôle"
          select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tous</MenuItem>
          <MenuItem value="ADMIN">ADMIN</MenuItem>
          <MenuItem value="SCOLARITE">SCOLARITE</MenuItem>
          <MenuItem value="STUDENT">STUDENT</MenuItem>
        </TextField>
        <Button variant="contained" onClick={handleSearch}>
          Rechercher
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setSelectedUser(null);
            setDialogOpen(true);
          }}
        >
          Ajouter
        </Button>
      </Stack>

      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
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
        />
      </Box>

      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        user={selectedUser}
        onSaved={() => {
          fetchUsers();
          setSnackbar({
            open: true,
            message: selectedUser
              ? "✅ Utilisateur mis à jour"
              : "✅ Utilisateur ajouté",
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

export default UsersTable;
