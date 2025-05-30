import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import axios from "../api/axios";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02"];

function AdminStats() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, c, g] = await Promise.all([
        axios.get("/user"),
        axios.get("/course"),
        axios.get("/grade"),
      ]);
      setUsers(u.data.users || []);
      setCourses(c.data || []);
      setGrades(g.data.grades || []);
    } catch (err) {
      console.error("Erreur chargement stats admin :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalUsers = users.length;
  const totalCourses = courses.length;

  const rolesCount = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const averageGrade =
    grades.length > 0
      ? (
          grades.reduce((sum, g) => sum + Number(g.grade), 0) / grades.length
        ).toFixed(2)
      : "N/A";

  const averageByCourse = courses.map((course) => {
    const relatedGrades = grades.filter((g) => g.course?._id === course._id);
    const avg =
      relatedGrades.length > 0
        ? (
            relatedGrades.reduce((sum, g) => sum + Number(g.grade), 0) /
            relatedGrades.length
          ).toFixed(2)
        : 0;
    return { course: course.name, average: parseFloat(avg) };
  });

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tableau de bord Administrateur
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: theme.palette.mode === "light"
                    ? "#e3f2fd"
                    : theme.palette.grey[900],
                borderRadius: 4,
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Utilisateurs
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: theme.palette.mode === "light"
                    ? "#e8f5e9"
                    : theme.palette.grey[900],
                borderRadius: 4,
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cours
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {totalCourses}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: theme.palette.mode === "light"
                    ? "#e3f2fd"
                    : theme.palette.grey[900],
                borderRadius: 4,
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Moyenne Générale
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {averageGrade}/100
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: theme.shadows[3], minHeight: 400 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Répartition des rôles
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={Object.entries(rolesCount).map(([role, value]) => ({
                        name: role,
                        value,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      labelLine={false}
                    >
                      {Object.keys(rolesCount).map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: theme.shadows[3] }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Moyenne des notes par cours
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={averageByCourse}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="course" />
                    <YAxis domain={[0, 20]} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="average"
                      fill="#1976d2"
                      name="Moyenne"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default AdminStats;
