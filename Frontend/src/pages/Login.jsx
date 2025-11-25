import { login } from "../api";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { showAlert } from "../components/showAlert";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    // setServerError("");

    try {
      const res = await login(values);

      showAlert({
        text: res.data.message,
        icon: "success",
      });

      const data = {
        _id: res.data.user._id,
        role: res.data.user.role,
        name: res.data.user.name,
        email: res.data.user.email,
        auth: res.data.auth,
      };
      dispatch(setUser(data));

      resetForm();
      navigate("/");
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

    setSubmitting(false);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" fontWeight={600} mb={2} align="center">
          Login
        </Typography>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
          }) => (
            <Form>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                margin="normal"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                margin="normal"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Typography
                sx={{
                  fontSize: 14,
                  textAlign: "right",
                  mb: 1,
                }}
              >
                Do not have account?
                <Link to={"/register"}>Register</Link>
              </Typography>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, py: 1.2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default Login;
