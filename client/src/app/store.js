import { configureStore } from "@reduxjs/toolkit";
import workspaceReducer from "../features/workspaceSlice";
import themeReducer from "../features/themeSlice";
import taskReducer from "../features/taskSlice";

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    theme: themeReducer,
    task: taskReducer,
  },
});
