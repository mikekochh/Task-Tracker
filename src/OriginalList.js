import React, { useRef } from 'react';
import * as c from '../../Constants';

const List = (props) => {

    let taskItemDrag = useRef();
    let taskItemDragOver = useRef();
    let newTaskTypeID = useRef();

    let taskTitleDrag = useRef();
    let taskTitleDragOver = useRef();


    function dragStartTitle(taskTypeID) {
        taskTitleDrag.current = taskTypeID;
    }

    function dragEndTitle() {
        if (taskTitleDragOver.current > -1 && 
            taskTitleDragOver.current !== null &&
            taskTitleDrag.current !== taskTitleDragOver.current) {
                moveAllTasksToNewTaskSection();
        }
    }

    function dragStart(index) {
        taskItemDrag.current = index;
    }

    function dragEnter(index, taskTypeID) {
        newTaskTypeID.current = taskTypeID;
        if (taskTitleDrag.current > -1 && taskTitleDrag.current !== null) {
            taskTitleDragOver.current = taskTypeID
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
        updateTaskList(newTaskList, taskTypeID);
    }

    function deleteTask(originalTaskList, startingTaskTypeID) {
        originalTaskList.splice(taskItemDrag.current, 1);
        const newTaskList = [...originalTaskList];
        updateTaskList(newTaskList, startingTaskTypeID);
        //resetAllTasksIsDragging();
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

    function dragEnd(startingTaskTypeID) {
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
        //resetAllTasksIsDragging();
    }

    // const resetAllTasksIsDragging = () => {
    //     for (let i = 0; i < 3; i++) {
    //         const originalTaskList = i === 0 ? [...props.activeTaskList]
    //             : i === 1 ? [...props.completedTaskList]
    //             : [...props.archivedTaskList];
    //         let newTaskList = [];
    //         originalTaskList.forEach(task=> {
    //             newTaskList.push({
    //                 taskName: task.taskName,
    //                 id: task.id,
    //                 isDragging: false
    //             });
    //         });
    //         updateTaskList(newTaskList, i);
    //     }
    // }


    const updateTaskList = (taskList, taskTypeID) => {
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

    const resetTaskBorders = () => {
        document.getElementById("taskSectionActive").classList.remove("active-border");
        document.getElementById("taskSectionCompleted").classList.remove("completed-border");
        document.getElementById("taskSectionArchived").classList.remove("archived-border");
        document.getElementById("taskSectionDeleted").classList.remove("deleted-border");
    }

    const resetDragVariables = () => {
        taskItemDrag.current = null;
        taskItemDragOver.current = null;
        newTaskTypeID.current = null;
    
        taskTitleDrag.current = null;
        taskTitleDragOver.current = null;
    }

    const dragOverTaskSection = (e, taskTypeID) => {
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

    const taskDoubleClick = (taskTypeID, index) => {
        if (taskTypeID === 0) {
            document.getElementById("txtAreaActiveTask" + index).style.display = "flex";
            document.getElementById("lblActiveTask" + index).style.display = "none";
        }
        else if (taskTypeID === 1) {
            document.getElementById("txtAreaCompletedTask" + index).style.display = "flex";
            document.getElementById("lblCompletedTask" + index).style.display = "none";
        }
        else {
            document.getElementById("txtAreaArchivedTask" + index).style.display = "flex";
            document.getElementById("lblArchivedTask" + index).style.display = "none";
        }
    }

    return (
        <div className="task-container">
            <React.Fragment>
                <div className="task-container-border" id="taskSectionActive" 
                    onDragOver={e => dragOverTaskSection(e, c.taskTypeActive)} onDragEnter={e => dragEnter(0, c.taskTypeActive)}>
                    <br></br>
                    <h2 draggable={"true"} 
                        droppable={"true"} 
                        className='display-task-title active draggable'
                        onDragStart={e => dragStartTitle(c.taskTypeActive)}
                        onDragEnd={e => dragEndTitle()}
                    >
                        ACTIVE TASKS
                    </h2>
                    
                    {props.activeTaskList.length > 0 && props.activeTaskList.map((task, index) => 
                        <React.Fragment>
                            <div key={task.id} 
                                draggable={"true"}
                                droppable={"true"}
                                onDragStart={e => dragStart(index)} 
                                onDragEnter={e => dragEnter(index, c.taskTypeActive)}
                                onDragEnd={e => dragEnd(c.taskTypeActive)}
                                onDoubleClick={e => taskDoubleClick(c.taskTypeActive, index)}
                                className="display-task-container draggable active"
                            >
                                <textarea id={"txtAreaActiveTask" + index} value={task.taskName} style={{fontSize: "18pt", display: "none"}} />
                                <label id={"lblActiveTask" + index} className="display-task-label">{task.taskName}</label>&nbsp;
                                <br></br>
                            </div>
                            {task.isDragging ? <div className="drag-indicator"></div> : null}
                        </React.Fragment>
                    )}
                </div>
                <div className='task-container-border' id="taskSectionCompleted" 
                    onDragOver={e => dragOverTaskSection(e, c.taskTypeCompleted)} onDragEnter={e => dragEnter(0, c.taskTypeCompleted)}>
                    <br></br>
                    <h2 draggable={"true"} 
                        droppable={"true"} 
                        className='completed display-task-title draggable'
                        onDragStart={e => dragStartTitle(c.taskTypeCompleted)}
                        onDragEnd={e => dragEndTitle()}
                    >
                        COMPLETED TASKS
                    </h2>
                    {props.completedTaskList.map((task, index) => 
                        <React.Fragment>
                            <div key={task.id} 
                                draggable={"true"}
                                droppable={"true"}
                                onDragStart={e => dragStart(index)} 
                                onDragEnter={e => dragEnter(index, c.taskTypeCompleted)}
                                onDragEnd={e => dragEnd(c.taskTypeCompleted)}
                                onDoubleClick={e => taskDoubleClick(c.taskTypeCompleted, index)}
                                className="display-task-container draggable completed"
                            >
                                <textarea id={"txtAreaCompletedTask" + index} value={task.taskName} style={{fontSize: "18pt", display: "none"}} />
                                <label id={"lblCompletedTask" + index} className="display-task-label">{task.taskName}</label>&nbsp;
                                <br></br>
                            </div>
                            {task.isDragging ? <div className="drag-indicator"></div> : null}
                        </React.Fragment>
                    )}
                </div>
                <div className='task-container-border' id="taskSectionArchived" 
                    onDragOver={e => dragOverTaskSection(e, c.taskTypeArchived)} onDragEnter={e => dragEnter(0, c.taskTypeArchived)}>
                    <br></br>
                    <h2 
                        draggable={"true"} 
                        droppable={"true"} 
                        className='draggable archived display-task-title'
                        onDragStart={e => dragStartTitle(c.taskTypeArchived)}
                        onDragEnd={e => dragEndTitle(c)}
                    >
                        ARCHIVED TASKS
                    </h2>
                    {props.archivedTaskList.map((task, index) => 
                        <React.Fragment>
                            <div key={task.id} 
                                draggable={"true"}
                                droppable={"true"}
                                onDragStart={e => dragStart(index)} 
                                onDragEnter={e => dragEnter(index, c.taskTypeArchived)}
                                onDragEnd={e => dragEnd(c.taskTypeArchived)}
                                onDoubleClick={e => taskDoubleClick(c.taskTypeArchived, index)}
                                className="display-task-container draggable archived"
                            >
                                <textarea id={"txtAreaArchivedTask" + index} value={task.taskName} style={{fontSize: "18pt", display: "none"}} />
                                <label id={"lblArchivedTask" + index} className="display-task-label">{task.taskName}</label>&nbsp;
                                <br></br>
                            </div>
                            {task.isDragging ? <div className="drag-indicator"></div> : null}
                        </React.Fragment>
                    )}
                </div>
                <br></br>
                <div id="taskSectionDeleted" 
                    className='task-container-border'
                    droppable={"true"}
                    onDragEnter={e => dragEnter(0, c.taskTypeDelete)}
                    onDragOver={e => dragOverTaskSection(e, c.taskTypeDelete)} 
                >
                    <img 
                        src='/images/trashCan.png' alt="" />
                    <h2>Task Trash</h2>
                </div>
            </React.Fragment>
        </div>
    );
};

export default List;