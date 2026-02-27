import { Inngest } from "inngest";
import  prisma  from "../configs/prisma.js"
import sendEmail from "../configs/nondemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });
//ingest function to create user data
const syncUserCreation=inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async({ event })=>{

        const {data}=event
        await prisma.user.create({
            data:{
                id: data.id,
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url
            }
        })
    }
)
//ingest function to delete user data
const syncUserDeletion=inngest.createFunction(
    {id:'delete-user-from-clerk'},
    {event: 'clerk/user.deleted'},
    async({ event })=>{

        const {data}=event
        await prisma.user.delete({
            where:{
                id: data.id
            }
        })
    }
)
//ingest function to update user data
const syncUserUpdation=inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async({ event })=>{

        const {data}=event
        await prisma.user.update({
            where:{
                id:data.id
            },
            data:{
               
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url
            }
        })
    }
)
const syncWorkspaceCreation=inngest.createFunction(
    {id: 'sync-workspace-from-clerk'},
    {event: 'clerk/organization.created'},
    async({event})=>{
        const {data}=event;
        await prisma.workspace.create({
            data:{
                id:data.id,
                name:data.name,
                slug: data.slug,
                ownerId:data.created_by,
                image_url: data.image_url
            }
        })
        await prisma.workspaceMember.create({
            data:{
                userId:data.created_by,
                workspaceId: data.id,
                role: "ADMIN"
            }
        })
    }
)
const syncWorkspaceUpdation=inngest.createFunction(
    {id: 'update-workspace-from-clerk'},
    {event:'clerk/organization.updated'},
    async({event})=>{
        const {data}=event;
        await prisma.workspace.update({
            where: {
                id:data.id
            },
            data: {
                name:data.name,
                slug: data.slug,
                image_url: data.image_url 
            }
        })
    }
)

const syncWorkspaceDeletion=inngest.createFunction(
    {id:'delete-workspace-with-clerk'},
    {event:'clerk/organization.deleted'},
    async({event}) => {
        const {data}=event;
        await prisma.workspace.delete({
            where: {
                id:data.id
            }
        })
    }
    
)

const syncWorkspaceMemberCreation=inngest.createFunction(
    {id: 'sync-workspace-member-from-clerk'},
    {event:'clerk/organizationInvitation.accepted'},
    async({ event })=>{
        await prisma.workspaceMember.create({
            data:{
                userId: data.user_id,
                workspaceId: data.organization_id,
                role: String(data.role_name).toUpperCase()
            }
        })
    }
)

// Inngest Function to sendEmail on task creation

const sendTaskAssignmentEmail = inngest.createFunction(
    { id: "send-task-assignment-mail" },
    { event: "app/task.assigned" },
    async ({ event, step }) => {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { assignee: true, project: true }
        })
        
        // First email body - Task Assignment
        await sendEmail({
            to: task.assignee.email,
            subject: `New Task Assignment in ${task.project.name}`,
            body: `
                Hi ${task.assignee.name},
                
                You have been assigned a new task: "${task.title}"
                
                Description: ${task.description || 'No description provided'}
                Due Date: ${new Date(task.due_date).toLocaleDateString()}
                Project: ${task.project.name}
                
                <a href="${origin}">View Task</a>
                
                Thanks,
                Project Management Team
            `
        })

        if (new Date(task.due_date).toLocaleDateString() != new Date().toDateString()) {
            await step.sleepUntil('wait-for-the-due-date', new Date(task.due_date))

            await step.run('check-if-task-is-completed', async () => {
                const task = await prisma.task.findUnique({
                    where: { id: taskId },
                    include: { assignee: true, project: true }
                })
                if (!task) return;

                if (task.status != "DONE") {
                    await step.run('send-task-reminder-mail', async () => {
                        // Second email body - Reminder
                        await sendEmail({
                            to: task.assignee.email,
                            subject: `⏰ Reminder: Task Due Today - ${task.project.name}`,
                            body: `
                                Hi ${task.assignee.name},
                                
                                This is a reminder that your task is due today!
                                
                                Task: "${task.title}"
                                Description: ${task.description || 'No description provided'}
                                Project: ${task.project.name}
                                Due Date: ${new Date(task.due_date).toLocaleDateString()}
                                
                                Please complete it as soon as possible.
                                
                                <a href="${origin}">View Task</a>
                                
                                Thanks,
                                Project Management Team
                            `
                        })
                    })
                }
            })
        }
    }
)





// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation,syncWorkspaceCreation,syncWorkspaceUpdation,syncWorkspaceDeletion,syncWorkspaceMemberCreation,sendTaskAssignmentEmail];