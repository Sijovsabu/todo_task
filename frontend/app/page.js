// frontend/app/page.js
"use client";

import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import TaskForm from "./components/TaskForm";
import styles from "../app/styles/TaskList.module.css";

const GET_TASKS = gql`
  query GetTasks {
    getTasks {
      _id
      title
      status
      dueDate
    }
  }
`;

const FILTER_TASKS = gql`
  query FilterTasksByStatus($status: String!) {
    filterTasksByStatus(status: $status) {
      _id
      title
      status
      dueDate
    }
  }
`;

export default function TaskListPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data, loading, error, refetch } = useQuery(
    statusFilter ? FILTER_TASKS : GET_TASKS,
    { variables: statusFilter ? { status: statusFilter } : {} }
  );

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks</p>;

  const tasks = data?.getTasks || data?.filterTasksByStatus || [];

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.filterContainer}>
            <label htmlFor="statusFilter">Filter by status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button onClick={() => refetch()}>Refresh</button>
          </div>

          <ul className={styles.taskList}>
            {tasks.map((task) => (
              <li key={task._id} className={styles.taskItem}>
                <Link href={`/task/${task._id}`} className={styles.taskLink}>
                  <strong>{task.title}</strong> | {task.status} |{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.right}>
          <TaskForm onTaskAdded={() => refetch()} />
        </div>
      </div>
    </div>
  );
}
