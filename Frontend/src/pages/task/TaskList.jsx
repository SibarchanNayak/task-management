import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Paper,
  TableSortLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { getTasks, deleteTask } from "../../api";
import ConfirmDialog from "../../components/ConfirmDialog";
import { showAlert } from "../../components/showAlert";

const TaskList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const loadTasks = useCallback(async () => {
    const res = await getTasks({
      page: page + 1,
      limit,
      q: debouncedSearch,
      sortBy,
      sortOrder,
    });

    setTasks(res.data.tasks);
    setTotal(res.data.total);
  }, [page, limit, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDelete = async () => {
    try {
      const res = await deleteTask(deleteId);
      showAlert({
        text: res.data.message,
        icon: "success",
      });
      setOpenConfirm(false);
      loadTasks();
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

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortBy(column);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  return (
    <Box p={2}>
      {/* Toolbar */}
      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isSmallScreen ? "stretch" : "center"}
        mb={2}
        gap={isSmallScreen ? 1 : 0}
      >
        <TextField
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          fullWidth={isSmallScreen}
          sx={{ maxWidth: isSmallScreen ? "100%" : 250 }}
        />

        <Button
          variant="contained"
          onClick={() => navigate("/tasks/create")}
          sx={{ mt: isSmallScreen ? 1 : 0 }}
        >
          + Create Task
        </Button>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "70vh", overflowX: "auto" }}
      >
        <Table stickyHeader size={isSmallScreen ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap", width: "30px" }}>
                Sl. No.
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "title"}
                  direction={sortBy === "title" ? sortOrder : "asc"}
                  onClick={() => handleSort("title")}
                >
                  Title
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? sortOrder : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "priority"}
                  direction={sortBy === "priority" ? sortOrder : "asc"}
                  onClick={() => handleSort("priority")}
                >
                  Priority
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "dueDate"}
                  direction={sortBy === "dueDate" ? sortOrder : "asc"}
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>

              <TableCell width={100}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={task._id}>
                <TableCell sx={{ fontSize: "0.7rem" }}>
                  {limit * page + index + 1}
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/tasks/${task._id}/edit`)}
                      size="small"
                    >
                      <Edit fontSize={isSmallScreen ? "small" : "medium"} />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteId(task._id);
                        setOpenConfirm(true);
                      }}
                      size="small"
                    >
                      <Delete fontSize={isSmallScreen ? "small" : "medium"} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => {
          setLimit(parseInt(e.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <ConfirmDialog
        open={openConfirm}
        title="Delete Task?"
        message="Are you sure you want to delete this task?"
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default TaskList;
