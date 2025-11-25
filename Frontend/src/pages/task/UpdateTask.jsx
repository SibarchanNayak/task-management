import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../../api";
import { showAlert } from "../../components/showAlert";

const validationSchema = Yup.object({
  title: Yup.string().max(200, "Max 200 characters"),
  description: Yup.string(),
  status: Yup.string().oneOf(["todo", "in_progress", "done", "blocked"]),
  priority: Yup.string().oneOf(["low", "medium", "high", "critical"]),
  dueDate: Yup.date().nullable(),
});

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing task
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTaskById(id);
        const t = res.data;

        setInitialValues({
          title: t.title || "",
          description: t.description || "",
          status: t.status || "todo",
          priority: t.priority || "medium",
          dueDate: t.dueDate ? t.dueDate.split("T")[0] : "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading || !initialValues)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  const onSubmit = async (values) => {
    try {
      const res = await updateTask(id, values);
      showAlert({
        text: res.data.message,
        icon: "success",
      });
      navigate("/tasks");
    } catch (error) {
      if (error.response) {
        showAlert({
          text: error.response.data.message,
          icon: "error",
        });
      } else {
        showAlert({
          text: "Something went wrong",
          icon: "error",
        });
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          Update Task
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <TextField
                fullWidth
                name="title"
                label="Title"
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                margin="normal"
              />

              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={3}
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                margin="normal"
              />

              <TextField
                select
                fullWidth
                name="status"
                label="Status"
                value={values.status}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                name="priority"
                label="Priority"
                value={values.priority}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </TextField>

              <TextField
                fullWidth
                name="dueDate"
                label="Due Date"
                type="date"
                value={values.dueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />

              <Box mt={3}>
                <Button type="submit" variant="contained" fullWidth>
                  Update Task
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default UpdateTask;
