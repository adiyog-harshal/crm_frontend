import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./Tasks.css";
const Tasks = () => {
const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    task_name: "",
    start_date: "",
    due_date: "",
    task_status: "Pending",
    priority: "Medium",
    assigned_to: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("tasks/list/");
      console.log("TASK LIST:", response.data);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.results || [];

    setTasks(data);
  } catch (error) {
    console.error("TASK FETCH ERROR:", error.response?.data);
  }
  };

  const editTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      task_name: task.task_name || "",
      due_date: task.due_date || "",
      task_status: task.task_status || "Pending",
      priority: task.priority || "Medium",
      assigned_to: task.assigned_to || "",
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setTaskForm({
      task_name: "",
      due_date: "",
      task_status: "Pending",
      priority: "Medium",
      assigned_to: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const saveTask = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      task_name: taskForm.task_name,
      description: taskForm.description || "",
      priority: taskForm.priority,
      task_status: taskForm.task_status,
      assigned_to: taskForm.assigned_to,
      start_date: taskForm.start_date,
      due_date: taskForm.due_date,
      status: true,
    };


    console.log("TASK PAYLOAD:", payload);

    let response;

    if (editingTask) {
      response = await api.put(
        `tasks/update/${editingTask.id}/`,
        payload
      );
    } else {
      response = await api.post(
        "tasks/create/",
        payload
      );
    }

    console.log("TASK RESPONSE:", response.data);

    alert(
      editingTask
        ? "Task updated successfully"
        : "Task created successfully"
    );

    await fetchTasks();
    closeModal();

  } catch (error) {
    console.error("TASK SAVE ERROR:", error);
    console.error("STATUS:", error.response?.status);
    console.error("URL:", error.config?.url);
    console.error("BACKEND:", error.response?.data);

    alert(
      JSON.stringify(
        error.response?.data || error.message,
        null,
        2
      )
    );
  }
};

  const deleteTask = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/api/tasks/delete/${id}/`);
    await fetchTasks();
    alert("Task deleted successfully.");
  } catch (error) {
    console.error("Delete error:", error.response?.data || error);
    alert("Unable to delete task.");
  }
};

const handleTaskSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      // We will put your actual task fields here
    };

    console.log("TASK PAYLOAD:", payload);

    const response = await api.post(
      "tasks/create/",
      payload
    );

    console.log("TASK CREATED:", response.data);

    alert("Task created successfully");

    await fetchTasks();

    setActiveModal(null);

  } catch (error) {
    console.error("========== TASK SAVE ERROR ==========");
    console.error("STATUS:", error.response?.status);
    console.error("URL:", error.config?.url);
    console.error("BACKEND:", error.response?.data);

    alert(
      JSON.stringify(
        error.response?.data || error.message,
        null,
        2
      )
    );
  }
};

  return (
    <div className="tasks-page">

      {/* Top Bar */}
      <div className="tasks-topbar">
        <h2>Tasks</h2>

        <div className="topbar-row">
          <input
            type="text"
            placeholder="Search records..."
            className="top-search"
          />

          <button
            className="create-btn"
            onClick={openCreateModal}
          >
            + Create Task
          </button>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <form onSubmit={saveTask}>
          <h3>{editingTask ? "Edit Task" : "Create Task"}</h3>

          <label>Subject:</label>
          <input
            type="text"
            placeholder="Enter Task Subject"
            value={taskForm.task_name}
            onChange={(event) => setTaskForm({ ...taskForm, task_name: event.target.value })}
            required
          />

          <label>Start Date:</label>
            <input
              type="date"
              value={taskForm.start_date}
              onChange={(event) =>
                setTaskForm({
                  ...taskForm,
                  start_date: event.target.value,
                })
              }
              required
            />

          <label>Due Date:</label>
          <input
            type="date"
            value={taskForm.due_date}
            onChange={(event) => setTaskForm({ ...taskForm, due_date: event.target.value })}
            required
          />

          <label>Status:</label>
          <select
            value={taskForm.task_status}
            onChange={(event) => setTaskForm({ ...taskForm, task_status: event.target.value })}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <label>Priority:</label>
          <select
            value={taskForm.priority}
            onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
          >
            <option value="LOW">Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <label>Assigned To:</label>
          <input
            type="text"
            value={taskForm.assigned_to}
            onChange={(event) => setTaskForm({ ...taskForm, assigned_to: event.target.value })}
            required
          />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
            <button type="submit" className="save-btn">Save Task</button>
          </div>
        </form>
      )}

      {/* Toolbar */}
      <div className="tasks-toolbar">
        <div className="toolbar-top">
          <span className="all-records-label">
            All Tasks ({tasks.length})
          </span>
        </div>

        <div className="toolbar-icons">
          <button>Filter</button>
          <h4 className="sort-toolbar">Sort</h4>
        </div>
      </div>

      <div className="tasks-body">

        {/* Left Filter Panel */}
        <div className="filter-panel">
          <h4>Filter Tasks By</h4>

          <input
            type="text"
            placeholder="Search"
            className="filter-search"
          />

          <p className="filter-heading">System Defined Filter</p>

          <ul>
            <li><input type="checkbox" /> Cadences</li>
            <li><input type="checkbox" /> Locked</li>
            <li><input type="checkbox" /> Record Action</li>
            <li><input type="checkbox" /> Related Record Action</li>
            <li><input type="checkbox" /> Touched Records</li>
            <li><input type="checkbox" /> Untouched Records</li>
          </ul>
        </div>

        {/* Table */}
        <div className="table-section">
          <table className="tasks-table">

            <thead>
              <tr>
                <th>Subject</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.task_name}</td>
                    <td>{task.start_date}</td>
                    <td>{task.due_date}</td>
                    <td>{task.task_status}</td>
                    <td>{task.priority}</td>

                    <td className="action-buttons">

                    <button
                      className="edit-btn"
                      onClick={() => editTask(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>

                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No Tasks Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default Tasks;
