import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import * as c from '../../Constants';

const List = (props) => {

    let taskItemDrag = useRef();
    let taskItemDragOver = useRef();
    let newTaskTypeID = useRef();

    function dragStartTitle(taskTypeID) {

    }

    function dragEnterTitle(taskTypeID) {

    }

    function dragEndTitle(taskTypeID) {

    }

    function dragStart(index) {
        taskItemDrag.current = index;
    }

    function dragEnter(index, taskTypeID) {
        newTaskTypeID.current = taskTypeID;
        if (taskTypeID === 3) {
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
        //newTaskList[index].isDragging = true;
        updateTaskList(newTaskList, taskTypeID);
    }

    function deleteTask(originalTaskList, startingTaskTypeID) {
        originalTaskList.splice(taskItemDrag.current, 1);
        const newTaskList = [...originalTaskList];
        updateTaskList(newTaskList, startingTaskTypeID);
        //resetAllTasksIsDragging();
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
                        onDragEnter={e => dragEnterTitle(c.taskTypeActive)}
                        onDragEnd={e => dragEndTitle(c.taskTypeActive)}
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
                                <Link to={'/edit/' + task.id}>
                                    <button id="btnEdit" />
                                </Link>&nbsp;
                                <br></br>
                            </div>
                            {task.isDragging ? <div className="drag-indicator"></div> : null}
                        </React.Fragment>
                    )}
                </div>
                <div className='task-container-border' id="taskSectionCompleted" 
                    onDragOver={e => dragOverTaskSection(e, c.taskTypeCompleted)} onDragEnter={e => dragEnter(0, c.taskTypeCompleted)}>
                    <br></br>
                    <h2 draggable={"true"} droppable={"true"} className='completed display-task-title draggable'>COMPLETED TASKS</h2>
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
                                <Link to={'/edit/' + task.id}>
                                    <button id="btnEdit" />
                                </Link>&nbsp;
                                <br></br>
                            </div>
                            {task.isDragging ? <div className="drag-indicator"></div> : null}
                        </React.Fragment>
                    )}
                </div>
                <div className='task-container-border' id="taskSectionArchived" 
                    onDragOver={e => dragOverTaskSection(e, c.taskTypeArchived)} onDragEnter={e => dragEnter(0, c.taskTypeArchived)}>
                    <br></br>
                    <h2 draggable={"true"} droppable={"true"} className='draggable archived display-task-title'>ARCHIVED TASKS</h2>
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
                                <Link to={'/edit/' + task.id}>
                                    <button id="btnEdit" />
                                </Link>&nbsp;
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