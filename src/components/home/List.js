import React, { useRef } from 'react';
import * as c from '../../Main';
import TaskListSection from '../TaskList/TaskListSection';
import TrashSection from '../Trash/TrashSection';

const List = (props) => {

    let taskItemDrag = useRef();
    let taskItemDragOver = useRef();
    let newTaskTypeID = useRef();

    let taskTitleDrag = useRef();
    let taskTitleDragOver = useRef();

    let taskOutsideBorders = useRef();

    let taskBeingChanged = useRef();
    let taskBeingChangedTaskTypeID = useRef();
    let taskBeingChangedIndex = useRef();


    function dragStartTitle(taskTypeID) {
        console.log("dragStartTitle running...");
        taskTitleDrag.current = taskTypeID;
    }

    function dragEndTitle() {
        console.log("dragEndTitle running...");
        if (taskOutsideBorders.current) {
            return;
        }
        if (taskTitleDragOver.current > -1 && 
            taskTitleDragOver.current !== null &&
            taskTitleDrag.current !== taskTitleDragOver.current) {
                moveAllTasksToNewTaskSection();
        }
        resetTaskBorders();
    }

    function dragStart(index) {
        console.log("dragStart running...");
        taskItemDrag.current = index;
    }

    function dragEnter(index, taskTypeID) {
        console.log("dragEnter running...");
        newTaskTypeID.current = taskTypeID;
        if (taskTitleDrag.current > -1 && taskTitleDrag.current !== null) {
            taskTitleDragOver.current = taskTypeID;
            return;
        }
        else if (taskTypeID === 3) {
            return;
        }

        taskItemDragOver.current = index;

        const firstTaskList = taskTypeID === 0 ? [...props.activeTaskList] :
            taskTypeID === 1 ? [...props.completedTaskList] :
            [...props.archivedTaskList];

        let newTaskList = [];
        firstTaskList.forEach(task => {
            newTaskList.push({
                taskName: task.taskName,
                id: task.id,
                isDragging: false
            });
        });
        //this line makes red lines appear, might need it down the road
        //newTaskList[index].isDragging = true;
        //updateTaskList(newTaskList, taskTypeID);
    }

    function deleteTask(originalTaskList, startingTaskTypeID) {
        originalTaskList.splice(taskItemDrag.current, 1);
        const newTaskList = [...originalTaskList];
        updateTaskList(newTaskList, startingTaskTypeID);
    }

    const moveAllTasksToNewTaskSection = () => {
        const firstTaskList = taskTitleDrag.current === 0 ? [...props.activeTaskList]
            : taskTitleDrag.current === 1 ? [...props.completedTaskList]
            : [...props.archivedTaskList];
        
        const secondTaskList = taskTitleDragOver.current === 0 ? [...props.activeTaskList]
            : taskTitleDragOver.current === 1 ? [...props.completedTaskList]
            : [...props.archivedTaskList];

        const newTaskList = secondTaskList.concat(firstTaskList);
        updateTaskList(newTaskList, taskTitleDragOver.current);
        updateTaskList([], taskTitleDrag.current);
    }

    const updateTaskName = (newTaskName, taskIndex, taskTypeID) => {
        const taskList = taskTypeID === 0 ? [...props.activeTaskList]
            : taskTypeID === 1 ? [...props.completedTaskList]
            : [...props.archivedTaskList];
        
        taskList.forEach((task, index) => {
            if (index === taskIndex) {
                taskList[index].taskName = newTaskName;
            }
        });
        updateTaskList(taskList, taskTypeID);
    }

    function dragEnd(startingTaskTypeID) {
        console.log("dragEnd running...");
        if (taskOutsideBorders.current) {
            return;
        }
        const originalTaskList = startingTaskTypeID === 0 ? [...props.activeTaskList]
            : startingTaskTypeID === 1 ? [...props.completedTaskList]
            : [...props.archivedTaskList];

        const currentTaskItemMain = startingTaskTypeID === 0 ? props.activeTaskList[taskItemDrag.current]
            : startingTaskTypeID === 1 ? props.completedTaskList[taskItemDrag.current]
            : props.archivedTaskList[taskItemDrag.current];


        if (newTaskTypeID.current === 3) {
            deleteTask(originalTaskList, startingTaskTypeID);
            resetTaskBorders();
            return;
        }

        const newTaskList = newTaskTypeID.current === 0 ? [...props.activeTaskList]
            : newTaskTypeID.current === 1 ? [...props.completedTaskList]
            : [...props.archivedTaskList];

        if (startingTaskTypeID === newTaskTypeID.current) {
            newTaskList.splice(taskItemDrag.current, 1);
            newTaskList.splice(taskItemDragOver.current, 0, currentTaskItemMain);
        }
        else {
            originalTaskList.splice(taskItemDrag.current, 1);
            newTaskList.splice(taskItemDragOver.current+1, 0, currentTaskItemMain);
            updateTaskList(originalTaskList, startingTaskTypeID);
        }

        currentTaskItemMain.isDragging = false;
        let finalTaskList = [];
        newTaskList.forEach(task=> {
            finalTaskList.push({
                taskName: task.taskName,
                id: task.id,
                isDragging: false
            });
        });
        updateTaskList(finalTaskList, newTaskTypeID.current);
        resetTaskBorders();
        resetDragVariables();
    }


    const updateTaskList = (taskList, taskTypeID) => {
        console.log("updateTaskList running...");
        switch(taskTypeID) {
            case 0:
                props.updateActiveTaskList(taskList);
                break;
            case 1:
                props.updateCompletedTaskList(taskList);
                break;
            case 2:
                props.updateArchivedTaskList(taskList);
                break;
            default:
                break;
        }
    }



    const resetDragVariables = () => {
        taskItemDrag.current = null;
        taskItemDragOver.current = null;
        newTaskTypeID.current = null;
    
        taskTitleDrag.current = null;
        taskTitleDragOver.current = null;
    }

    const clickEvent = (e) => {
        const index = e.target.getAttribute('index');
        const taskTypeID = e.target.getAttribute("taskTypeID");
        if (parseInt(index) === taskBeingChangedIndex.current &&
            parseInt(taskTypeID) === taskBeingChangedTaskTypeID.current) {
            return;
        }

        doneEditingTaskName(taskBeingChangedIndex.current, taskBeingChangedTaskTypeID.current);
        taskBeingChanged.current = false;
    }


    const taskDoubleClick = (index, taskTypeID) => {
        if (taskTypeID === 0) {
            document.getElementById("txtAreaActiveTask" + index).style.display = "flex";
            document.getElementById("lblActiveTask" + index).style.display = "none";
            document.getElementById("titleActiveTask" + index).style.display = "flex";
            console.log(document.getElementById("divActiveTask" + index).draggable);
            document.getElementById("divActiveTask" + index).draggable = false;
            console.log(document.getElementById("divActiveTask" + index).draggable);
        }
        else if (taskTypeID === 1) {
            document.getElementById("txtAreaCompletedTask" + index).style.display = "flex";
            document.getElementById("lblCompletedTask" + index).style.display = "none";
            document.getElementById("titleCompletedTask" + index).style.display = "flex";
            document.getElementById("divCompletedTask" + index).draggable = "false"
        }
        else {
            document.getElementById("txtAreaArchivedTask" + index).style.display = "flex";
            document.getElementById("lblArchivedTask" + index).style.display = "none";
            document.getElementById("titleArchivedTask" + index).style.display = "flex";
            document.getElementById("divArchivedTask" + index).draggable = "false"
        }
        taskBeingChanged.current = true;
        taskBeingChangedTaskTypeID.current = taskTypeID;
        taskBeingChangedIndex.current = index;

        document.addEventListener('click', clickEvent);
    }

    const doneEditingTaskName = (index, taskTypeID) => {
        console.log("doneEditingTaskName running...");
        if (taskTypeID === 0) {
            document.getElementById("txtAreaActiveTask" + index).style.display = "none";
            document.getElementById("lblActiveTask" + index).style.display = "flex";
            document.getElementById("titleActiveTask" + index).style.display = "none";
        }
        else if (taskTypeID === 1) {
            document.getElementById("txtAreaCompletedTask" + index).style.display = "none";
            document.getElementById("lblCompletedTask" + index).style.display = "flex";
            document.getElementById("titleActiveTask" + index).style.display = "none";
        }
        else {
            document.getElementById("txtAreaArchivedTask" + index).style.display = "none";
            document.getElementById("lblArchivedTask" + index).style.display = "flex";
            document.getElementById("titleActiveTask" + index).style.display = "none";
        }

        document.removeEventListener('click', clickEvent);
    }

    const dragOverTaskSection = (e, taskTypeID) => {
        taskOutsideBorders.current = false;
        resetTaskBorders();
        e.preventDefault();
        if (taskTypeID === 0) {
            document.getElementById("taskSectionActive").classList.add("active-border");
        }
        else if (taskTypeID === 1) {
            document.getElementById("taskSectionCompleted").classList.add("completed-border");
        }
        else if (taskTypeID === 2) {
            document.getElementById("taskSectionArchived").classList.add("archived-border");
        }
        else {
            document.getElementById("taskSectionDeleted").classList.add("deleted-border");
        }
    }

    const resetTaskBorders = () => {
        document.getElementById("taskSectionActive").classList.remove("active-border");
        document.getElementById("taskSectionCompleted").classList.remove("completed-border");
        document.getElementById("taskSectionArchived").classList.remove("archived-border");
        document.getElementById("taskSectionDeleted").classList.remove("deleted-border");
    }


    const exitTaskSections = () => {
        taskOutsideBorders.current = true;
        resetTaskBorders();
    }

    let taskListItemFunctions = {
        dragStart: dragStart,
        dragEnter: dragEnter,
        dragEnd: dragEnd,
        taskDoubleClick: taskDoubleClick,
        updateTaskName: updateTaskName,
        doneEditingTaskName: doneEditingTaskName
    };

    let taskListSectionFunctions = {
        dragOverTaskSection: dragOverTaskSection,
        dragEnter: dragEnter,
        dragStartTitle: dragStartTitle,
        dragEndTitle: dragEndTitle,
        exitTaskSections: exitTaskSections
    }

    let trashSectionFunctions = {
        dragEnter: dragEnter,
        dragOverTaskSection: dragOverTaskSection,
        exitTaskSections: exitTaskSections
    }

    return (
        <div className="task-container">
                {/* Turn this into a for loop for all four sections, eventually for loop for all sections added by user */}
                <TaskListSection taskTypeID={c.taskTypeActive}
                                        taskListSectionFunctions={taskListSectionFunctions}
                                        taskListItemFunctions={taskListItemFunctions}
                                        taskList={props.activeTaskList}
                />
                <TaskListSection taskTypeID={c.taskTypeCompleted}
                                        taskListSectionFunctions={taskListSectionFunctions}
                                        taskListItemFunctions={taskListItemFunctions}
                                        taskList={props.completedTaskList}
                />
                <TaskListSection taskTypeID={c.taskTypeArchived}
                                    taskListSectionFunctions={taskListSectionFunctions}
                                    taskListItemFunctions={taskListItemFunctions}
                                    taskList={props.archivedTaskList}
                />
                <TrashSection trashSectionFunctions={trashSectionFunctions} />
        </div>
    );
};

export default List;