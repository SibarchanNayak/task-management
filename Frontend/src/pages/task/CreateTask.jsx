import {
  Box,
  Button,
  Paper,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { createTask } from "../../api";
import { showAlert } from "../../components/showAlert";

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string(),
  priority: Yup.string(),
  dueDate: Yup.date().nullable(),
});

const CreateTask = () => {
  const navigate = useNavigate();

  return (
    <Box p={3}>
      <Paper sx={{ p: 3, maxWidth: 600, margin: "auto" }}>
        <Typography variant="h5" mb={2}>
          Create Task
        </Typography>

        <Formik
          initialValues={{
            title: "",
            description: "",
            status: "todo",
            priority: "medium",
            dueDate: null,
          }}
          validationSchema={schema}
          onSubmit={async (values) => {
            try {
              const res = await createTask(values);
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
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                multiline
                rows={3}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                margin="normal"
              />

              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={values.status}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="todo">Todo</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </TextField>

              <TextField
                fullWidth
                select
                label="Priority"
                name="priority"
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
                label="Due Date"
                name="dueDate"
                type="date"
                value={values.dueDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Create
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default CreateTask;
