// frontend/app/components/TaskForm.js
"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import styles from "../styles/TaskForm.module.css";

const ADD_TASK = gql`
  mutation AddTask(
    $title: String!
    $description: String
    $status: String
    $dueDate: String
  ) {
    addTask(
      title: $title
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      _id
      title
    }
  }
`;

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [dueDate, setDueDate] = useState("");

  const [addTask, { loading }] = useMutation(ADD_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTask({ variables: { title, description, status, dueDate } });
      setTitle("");
      setDescription("");
      setStatus("Todo");
      setDueDate("");
      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Error adding task");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Title:
          <input
            className={styles.input}
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Description:
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Status:
          <select
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Due Date:
          <input
            className={styles.date}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
      </div>

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
