import React from "react";
import { Navigate } from "react-router-dom";
import Header from "../Header";
import { Box } from "@mui/material";

const Protected = ({ isAuth, userType, children }) => {
  if (isAuth) {
    return (
      <Box>
        <Header />
        <Box p={2}>{children}</Box>
      </Box>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default Protected;
