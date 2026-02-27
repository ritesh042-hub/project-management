import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, updateTask } from "../features/taskSlice";
import {
  Bug,
  CalendarIcon,
  GitCommit,
  MessageSquare,
  Square,
  Trash,
  XIcon,
  Zap,
} from "lucide-react";

const typeIcons = {
  BUG: { icon: Bug, color: "text-red-600 dark:text-red-400" },
  FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
  TASK: { icon: Square, color: "text-green-600 dark:text-green-400" },
  IMPROVEMENT: { icon: GitCommit, color: "text-purple-600 dark:text-purple-400" },
  OTHER: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400" },
};

const priorityTexts = {
  LOW: {
    background: "bg-red-100 dark:bg-red-950",
    prioritycolor: "text-red-600 dark:text-red-400",
  },
  MEDIUM: {
    background: "bg-blue-100 dark:bg-blue-950",
    prioritycolor: "text-blue-600 dark:text-blue-400",
  },
  HIGH: {
    background: "bg-emerald-100 dark:bg-emerald-950",
    prioritycolor: "text-emerald-600 dark:text-emerald-400",
  },
};

const ProjectTasks = ({ tasks = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const [selectedTasks, setSelectedTasks] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    type: "",
    priority: "",
    assignee: "",
  });

  const assigneeList = useMemo(
    () =>
      Array.from(
        new Set(
          safeTasks.map((t) => t?.assignee?.name).filter(Boolean)
        )
      ),
    [safeTasks]
  );

  const filteredTasks = useMemo(() => {
    return safeTasks.filter((task) => {
      const { status, type, priority, assignee } = filters;
      return (
        (!status || task?.status === status) &&
        (!type || task?.type === type) &&
        (!priority || task?.priority === priority) &&
        (!assignee || task?.assignee?.name === assignee)
      );
    });
  }, [filters, safeTasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      toast.loading("Updating status...");

      await new Promise((resolve) => setTimeout(resolve, 800));

      const original = safeTasks.find((t) => t.id === taskId);
      if (!original) return;

      const updatedTask = { ...original, status: newStatus };
      dispatch(updateTask(updatedTask));

      toast.dismissAll();
      toast.success("Task updated");
    } catch (error) {
      toast.dismissAll();
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!selectedTasks.length) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete selected tasks?"
    );
    if (!confirmDelete) return;

    dispatch(deleteTask(selectedTasks));
    toast.success("Tasks deleted");
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        {["status", "type", "priority", "assignee"].map((name) => {
          const options = {
            status: [
              { label: "All Statuses", value: "" },
              { label: "To Do", value: "TODO" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Done", value: "DONE" },
            ],
            type: [
              { label: "All Types", value: "" },
              { label: "Task", value: "TASK" },
              { label: "Bug", value: "BUG" },
              { label: "Feature", value: "FEATURE" },
              { label: "Improvement", value: "IMPROVEMENT" },
              { label: "Other", value: "OTHER" },
            ],
            priority: [
              { label: "All Priorities", value: "" },
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
            ],
            assignee: [
              { label: "All Assignees", value: "" },
              ...assigneeList.map((n) => ({ label: n, value: n })),
            ],
          };

          return (
            <select
              key={name}
              name={name}
              onChange={handleFilterChange}
              className="border px-3 py-1 rounded text-sm"
            >
              {options[name].map((opt, idx) => (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        })}

        {selectedTasks.length > 0 && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1 flex items-center gap-2 rounded bg-indigo-500 text-white text-sm"
          >
            <Trash className="size-3" /> Delete
          </button>
        )}
      </div>

      {/* Tasks Table */}
      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-100">
            <tr>
              <th className="px-2">
                <input
                  type="checkbox"
                  checked={selectedTasks.length === safeTasks.length && safeTasks.length > 0}
                  onChange={() =>
                    selectedTasks.length === safeTasks.length
                      ? setSelectedTasks([])
                      : setSelectedTasks(safeTasks.map((t) => t.id))
                  }
                />
              </th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Assignee</th>
              <th className="px-4 py-2">Due Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const { icon: Icon, color } = typeIcons[task?.type] || {};
                const { background, prioritycolor } =
                  priorityTexts[task?.priority] || {};

                return (
                  <tr key={task.id} className="border-t">
                    <td className="px-2">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() =>
                          setSelectedTasks((prev) =>
                            prev.includes(task.id)
                              ? prev.filter((i) => i !== task.id)
                              : [...prev, task.id]
                          )
                        }
                      />
                    </td>

                    <td className="px-4 py-2">{task?.title}</td>

                    <td className="px-4 py-2 flex items-center gap-2">
                      {Icon && <Icon className={`size-4 ${color}`} />}
                      <span className={`${color} text-xs uppercase`}>
                        {task?.type}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${background} ${prioritycolor}`}
                      >
                        {task?.priority}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      <select
                        value={task?.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
                        className="px-2 py-1 rounded text-sm"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>

                    <td className="px-4 py-2">
                      {task?.assignee?.name || "-"}
                    </td>

                    <td className="px-4 py-2">
                      {task?.due_date
                        ? format(new Date(task.due_date), "dd MMM yyyy")
                        : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTasks;
