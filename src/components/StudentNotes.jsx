import { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  Card,
  CardContent,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import dayjs from "dayjs";

function StudentNotes() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState("");

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/grade/student/${user._id}`);
      setGrades(res.data);
    } catch (err) {
      console.error("Erreur chargement notes :", err);
      setError("Impossible de charger les notes. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const getPeriodKey = (dateStr) => {
    const d = dayjs(dateStr);
    return `${d.year()}-${d.month() < 6 ? "S1" : "S2"}`;
  };

  const allPeriods = useMemo(
    () => [...new Set(grades.map((g) => getPeriodKey(g.date)))],
    [grades]
  );

  const filteredGrades = useMemo(
    () =>
      filter === "all"
        ? grades
        : grades.filter((g) => getPeriodKey(g.date) === filter),
    [grades, filter]
  );

  const chartData = useMemo(
    () =>
      filteredGrades.map((g) => ({
        course: g.course?.name || "Inconnu",
        grade: Number(g.grade),
      })),
    [filteredGrades]
  );

  const average = useMemo(() => {
    if (chartData.length === 0) return null;
    const sum = chartData.reduce((acc, curr) => acc + curr.grade, 0);
    return (sum / chartData.length).toFixed(2);
  }, [chartData]);

  const handleExportCSV = () => {
    const header = "Cours,Note\n";
    const rows = chartData
      .map((row) => `${row.course},${row.grade}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `notes_${filter || "all"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSnackbar("📄 Export CSV réussi !");
  };

  const handleSendByEmail = async () => {
    try {
      await axios.post(`/grade/send-bulletin`, {
        userId: user._id,
        filter: filter,
      });
      setSnackbar("📧 Bulletin envoyé par email !");
    } catch (err) {
      console.error("Erreur envoi email :", err);
      setSnackbar("❌ Échec de l'envoi du bulletin par email.");
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#2c3e50" }}
      >
        🧾 Bulletin de notes
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Semestre</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Semestre"
                >
                  <MenuItem value="all">Tous les semestres</MenuItem>
                  {allPeriods.map((period) => (
                    <MenuItem key={period} value={period}>
                      {period}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleExportCSV}>
                Exporter CSV
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSendByEmail}
              >
                Envoyer par Email
              </Button>
            </Stack>
          </Paper>

          {average && (
            <Typography variant="h6" sx={{ mb: 2, color: "#34495e" }}>
              Moyenne pour{" "}
              <strong>
                {filter === "all" ? "tous les semestres" : filter}
              </strong>{" "}
              :<span style={{ color: "#27ae60" }}> {average} / 20</span>
            </Typography>
          )}

          {filteredGrades.length === 0 ? (
            <Alert severity="info">
              Aucune note disponible pour ce semestre.
            </Alert>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {filteredGrades.map((g) => (
                  <Grid item xs={12} sm={6} md={4} key={g._id}>
                    <Card
                      elevation={3}
                      sx={{ borderLeft: "5px solid #3498db" }}
                    >
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {g.course?.name || "Cours inconnu"}
                        </Typography>
                        <Typography variant="h5" sx={{ color: "#2c3e50" }}>
                          {g.grade ?? "N/A"} / 20
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                          {dayjs(g.date).format("DD MMM YYYY")}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Paper elevation={2} sx={{ height: 350, p: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="course" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 20]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="grade" fill="#3498db" name="Note" />
                    {average && (
                      <ReferenceLine
                        y={parseFloat(average)}
                        stroke="#e74c3c"
                        strokeDasharray="4"
                        label={{
                          position: "top",
                          value: `Moyenne: ${average}`,
                          fill: "#e74c3c",
                        }}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </>
          )}
        </>
      )}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar("")}
        message={snackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

export default StudentNotes;
