//local storage values
export const LOCAL_STORAGE_KEY_ACTIVE = "activeTasks";
export const LOCAL_STORAGE_KEY_COMPLETED = "completedTasks";
export const LOCAL_STORAGE_KEY_ARCHIVED = 'archivedTasks';


//task type IDs
export const taskTypeActive = 0;
export const taskTypeCompleted = 1;
export const taskTypeArchived = 2;
export const taskTypeDelete = 3;


export const getTaskTypeName = (taskTypeID) => {
    return taskTypeID === 0 ? "active" : taskTypeID === 1 ? "completed" : "archived";
}

export const getTaskTypeNameTitleCase = (taskTypeID) => {
    return taskTypeID === 0 ? "Active" : taskTypeID === 1 ? "Completed" : "Archived";

}