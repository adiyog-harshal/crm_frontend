import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./Tasks.css";
const Tasks = () => {
const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    task_name: "",
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
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch tasks");
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

  const saveTask = async (event) => {
    event.preventDefault();

    const payload = {
      ...taskForm,
      start_date: editingTask?.start_date || new Date().toISOString().slice(0, 10),
    };

    try {
      if (editingTask) {
        await api.put(`tasks/update/${editingTask.id}/`, {
          ...editingTask,
          ...payload,
        });
      } else {
        await api.post("tasks/create/", payload);
      }
      await fetchTasks();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Unable to save task. Please check the required fields.");
    }
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`tasks/delete/${id}/`);
      fetchTasks();
      alert("Task deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to delete task.");
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
