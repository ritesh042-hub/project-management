import express from "express";
import { createTask, deleteTask, updatedTask } from "../controllers/taskController.js";
const taskRouter = express.Router()

taskRouter.post('/',createTask)
taskRouter.put('/:id',updatedTask)
taskRouter.post('/delete',deleteTask)

export default taskRouter;