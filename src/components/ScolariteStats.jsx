import { useEffect, useState, useMemo } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  useTheme,
  Button,
  Alert,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "../api/axios";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GradeIcon from "@mui/icons-material/Grade";
import RefreshIcon from "@mui/icons-material/Refresh";

function ScolariteStats() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const COLORS = useMemo(
    () => [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
    [theme]
  );

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [uRes, cRes, gRes] = await Promise.all([
        axios.get("/user", { params: { role: "STUDENT" } }),
        axios.get("/course"),
        axios.get("/grade"),
      ]);
      setStudents(uRes.data.users || []);
      setCourses(cRes.data || []);
      setGrades(gRes.data.grades || []);
    } catch (err) {
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const averageByCourse = useMemo(() => {
    return courses.map((course) => {
      const relatedGrades = grades.filter((g) => g.course?._id === course._id);
      const avg =
        relatedGrades.length > 0
          ? (
              relatedGrades.reduce((sum, g) => sum + Number(g.grade), 0) /
              relatedGrades.length
            ).toFixed(2)
          : 0;
      return { name: course.name, value: parseFloat(avg) };
    });
  }, [courses, grades]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #e0f7fa, #e1f5fe)",
        minHeight: "100vh",
        py: 4,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
      >
        🎓 Statistiques de la Scolarité
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign="center"
        color="textSecondary"
        mb={2}
      >
        {students.length} étudiants — {courses.length} cours — {grades.length}{" "}
        notes
      </Typography>

      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={fetchData}
        sx={{ mb: 3 }}
      >
        Rafraîchir les données
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} justifyContent="center" maxWidth={900} mb={4}>
        {[
          {
            icon: <SchoolIcon />,
            label: "Étudiants",
            count: students.length,
            bg: theme.palette.primary,
          },
          {
            icon: <MenuBookIcon />,
            label: "Cours",
            count: courses.length,
            bg: theme.palette.info,
          },
          {
            icon: <GradeIcon />,
            label: "Notes",
            count: grades.length,
            bg: theme.palette.secondary,
          },
        ].map(({ icon, label, count, bg }, idx) => (
          <Grid
            item
            xs={12}
            sm={4}
            key={idx}
            display="flex"
            justifyContent="center"
          >
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                width: "100%",
                maxWidth: 250,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 8,
                },
                background: `linear-gradient(135deg, ${bg.light}, ${bg.main})`,
                color: "white",
              }}
            >
              <CardContent>
                {icon}
                <Typography variant="h6" textAlign="center">
                  {label}
                </Typography>
                <Typography variant="h3" fontWeight="bold" textAlign="center">
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box width="100%" maxWidth={900}>
        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent
            sx={{
              height: 400,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="medium"
              textAlign="center"
              gutterBottom
            >
              Moyenne des notes par cours
            </Typography>

            {averageByCourse.length === 0 ? (
              <Typography textAlign="center" color="textSecondary">
                Aucune donnée de notes disponible.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={averageByCourse}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={70}
                    paddingAngle={5}
                    labelLine={false}
                    isAnimationActive={true}
                    animationDuration={800}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {averageByCourse.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={theme.palette.background.paper}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)}`} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: "0.85rem" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default ScolariteStats;
