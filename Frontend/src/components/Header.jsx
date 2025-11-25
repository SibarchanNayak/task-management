import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../store/userSlice";
import { logout } from "../api";
import { showAlert } from "./showAlert";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.name);

  const handleLogout = async () => {
    try {
      const res = await logout();
      console.log("res", res.data);

      showAlert({
        text: res.data.message,
        icon: "success",
      });
      dispatch(resetUser());
      navigate("/login");
    } catch (error) {
      // console.log("error", error);

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
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Welcome, {userName || ""}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
