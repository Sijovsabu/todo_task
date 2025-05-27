// frontend/app/task/[id].js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import styles from "../../styles/TaskDetails.module.css";

const GET_TASK_BY_ID = gql`
  query GetTaskById($id: ID!) {
    getTaskById(id: $id) {
      _id
      title
      description
      status
      dueDate
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      _id
      status
    }
  }
`;

export default function TaskDetailsPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data, loading, error, refetch } = useQuery(GET_TASK_BY_ID, {
    variables: { id },
  });

  const [updateStatus] = useMutation(UPDATE_TASK_STATUS);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (data?.getTaskById?.status) {
      setNewStatus(data.getTaskById.status);
    }
  }, [data]);

  const handleStatusChange = async () => {
    try {
      await updateStatus({ variables: { id, status: newStatus } });
      refetch();
      router.push("/");
    } catch (err) {
      console.error("Error updating status:", err.message);
    }
  };

  if (loading) return <p className={styles.message}>Loading task details...</p>;
  if (error) return <p className={styles.message}>Error: {error.message}</p>;

  const task = data?.getTaskById;
  if (!task) return <p className={styles.message}>Task not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{task.title}</h1>
      <p className={styles.text}>
        <strong>Description:</strong> {task.description || "No description"}
      </p>
      <p className={styles.text}>
        <strong>Due Date:</strong>{" "}
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "No due date"}
      </p>

      <div className={styles.statusSection}>
        <label htmlFor="statusSelect" className={styles.label}>
          <strong>Status:</strong>
        </label>
        <select
          id="statusSelect"
          className={styles.select}
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button className={styles.button} onClick={handleStatusChange}>
          Update Status
        </button>
      </div>
    </div>
  );
}
