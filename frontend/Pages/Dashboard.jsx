import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import "./CSS/Dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    user: "",
  });

  const userData = JSON.parse(localStorage.getItem("user"));
  const role = userData?.user?.role;

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks ❌");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all");
      setUsers(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchTasks();
    if (role === "admin") fetchUsers();
  }, []);

  const createTask = async () => {
    if (!form.title) return toast.error("Enter title ⚠️");
    if (role === "admin" && !form.user)
      return toast.error("Select user ⚠️");

    try {
      await API.post("/tasks", form);
      setForm({ title: "", description: "", user: "" });
      fetchTasks();
      toast.success("Task added ✅");
    } catch {
      toast.error("Error ❌");
    }
  };

  const toggleTask = async (id) => {
    await API.put(`/tasks/${id}`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const deleteUser = async (id) => {
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Dashboard ({role})</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* CREATE TASK (FULL WIDTH ALWAYS) */}
      <div className="card">
        <h3>Create Task</h3>

        <div className="task-form">
          {role === "admin" && (
            <select
              value={form.user}
              onChange={(e) =>
                setForm({ ...form, user: e.target.value })
              }
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button onClick={createTask}>Add Task</button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        className={`dashboard-grid ${
          role === "admin" ? "admin-layout" : "user-layout"
        }`}
      >

        {/* TASKS SECTION */}
        <div className="card">
          <h3>Tasks</h3>

          <div className="tasks-grid">
            {tasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className={`task-card ${
                    task.completed ? "completed" : ""
                  }`}
                >
                  <h4
                    style={{
                      textDecoration: task.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {task.title}
                  </h4>

                  <p>{task.description}</p>

                  {role === "admin" && task.user && (
                    <p><b>Assigned:</b> {task.user?.name}</p>
                  )}

                  {role === "user" && (
                    <button
                      className="btn-complete"
                      onClick={() => toggleTask(task._id)}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                  )}

                  {role === "admin" && (
                    <button
                      className="btn-delete"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* USERS SECTION (ADMIN ONLY) */}
        {role === "admin" && (
          <div className="card">
            <h3>Users</h3>

            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              users.map((u) => (
                <div key={u._id} className="user-card">
                  <p><b>Name:</b> {u.name}</p>
                  <p><b>Email:</b> {u.email}</p>
                  <p><b>Role:</b> {u.role}</p>

                  <button
                    className="btn-delete"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete User
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}