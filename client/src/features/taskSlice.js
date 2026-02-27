import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },

    updateTask: (state, action) => {
      const updatedTask = action.payload;
      state.tasks = state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
    },

    deleteTask: (state, action) => {
      const idsToDelete = action.payload;
      state.tasks = state.tasks.filter(
        (task) => !idsToDelete.includes(task.id)
      );
    },
  },
});

export const { setTasks, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
