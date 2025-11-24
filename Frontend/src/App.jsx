import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TaskList from "./pages/task/TaskList";
import CreateTask from "./pages/task/CreateTask";
import Protected from "./components/Protected/Protected";
import { useSelector } from "react-redux";
import UpdateTask from "./pages/task/UpdateTask";

const App = () => {
  const isAuth = useSelector((state) => state.user.auth);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protected isAuth={isAuth}>
            <TaskList />
          </Protected>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/tasks"
        element={
          <Protected isAuth={isAuth}>
            <TaskList />
          </Protected>
        }
      />
      <Route
        path="/tasks/create"
        element={
          <Protected isAuth={isAuth}>
            <CreateTask />
          </Protected>
        }
      />
      <Route
        path="/tasks/:id/edit"
        element={
          <Protected isAuth={isAuth}>
            <UpdateTask />
          </Protected>
        }
      />

      <Route path="/*" element={<div>error</div>} />
    </Routes>
  );
};

export default App;
