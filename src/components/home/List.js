import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import * as c from '../../Constants';

const List = (props) => {

    let taskItemDrag = useRef();
    let taskItemDragOver = useRef();
    let newTaskTypeID = useRef();

    function dragStart(e, index) {
        taskItemDrag.current = index;
    }

    function dragEnter(e, index, taskTypeID) {
        newTaskTypeID.current = taskTypeID;
        if (taskTypeID === 3) {
            console.log("hello");
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
        newTaskList[index].isDragging = true;
        updateTaskList(newTaskList, taskTypeID);
    }

    function deleteTask(originalTaskList, currentTaskItemMain, startingTaskTypeID) {
        originalTaskList.splice(taskItemDrag.current, 1);
        const newTaskList = [...originalTaskList];
        updateTaskList(newTaskList, startingTaskTypeID);
        //resetAllTasksIsDragging();
    }

    function dragEnd(e, startingTaskTypeID) {

        const originalTaskList = startingTaskTypeID === 0 ? [...props.activeTaskList]
            : startingTaskTypeID === 1 ? [...props.completedTaskList]
            : [...props.archivedTaskList];

        const currentTaskItemMain = startingTaskTypeID === 0 ? props.activeTaskList[taskItemDrag.current]
            : startingTaskTypeID === 1 ? props.completedTaskList[taskItemDrag.current]
            : props.archivedTaskList[taskItemDrag.current];

        if (newTaskTypeID.current === 3) {
            deleteTask(originalTaskList, currentTaskItemMain, startingTaskTypeID);
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

    return (
        <div className="task-container">
            <React.Fragment>
                <div className="task-container-border" onDragOver={e => e.preventDefault()}>
                    <br></br>
                    <h2 className='display-task-title active'>ACTIVE TASKS</h2>
                    
                    {props.activeTaskList.length > 0 && props.activeTaskList.map((task, index) => 
                        <React.Fragment>
                            <div key={task.id} 
                                draggable={"true"}
                                droppable={"true"}
                                onDragStart={e => dragStart(e, index)} 
                                onDragEnter={e => dragEnter(e, index, c.taskTypeActive)}
                                onDragEnd={e => dragEnd(e, c.taskTypeActive)}
                                onDoubleClick={e => document.getElementById("btnEdit").click()}
                                className="display-task-container active"
                            >
                                <label className="display-task-label" style={{fontSize: "18pt"}}>{task.taskName}</label>&nbsp;
                                <Link to={'/edit/' + task.id}>
                                    <button id="btnEdit" />
                                </Link>&nbsp;
                                <br></br>
                            </div>
                            {task.isDragging ? <div className="drag-indicator"></div> : null}
                        </React.Fragment>
                    )}
                </div>
                <div className='task-container-border'>
                    <br></br>
                    <h2 className='completed display-task-title'>COMPLETED TASKS</h2>
                    {props.completedTaskList.map((task, index) => 
                        <React.Fragment>
                            <div key={task.id} 
                                draggable={"true"}
                                droppable={"true"}
                                onDragStart={e => dragStart(e, index)} 
                                onDragEnter={e => dragEnter(e, index, c.taskTypeCompleted)}
                                onDragEnd={e => dragEnd(e, c.taskTypeCompleted)}
                                onDoubleClick={e => document.getElementById("btnEdit").click()}
                                className="display-task-container completed"
                            >
                                <label style={{fontSize: "18pt"}}>{task.taskName}</label>&nbsp;
                                <Link to={'/edit/' + task.id}>
                                    <button id="btnEdit" />
                                </Link>&nbsp;
                                <br></br>
                            </div>
                            {task.isDragging ? <div className="drag-indicator"></div> : null}
                        </React.Fragment>
                    )}
                </div>
                <div className='task-container-border'>
                    <br></br>
                    <h2 className='archived display-task-title'>ARCHIVED TASKS</h2>
                    {props.archivedTaskList.map((task, index) => 
                        <React.Fragment>
                            <div key={task.id} 
                                draggable={"true"}
                                droppable={"true"}
                                onDragStart={e => dragStart(e, index)} 
                                onDragEnter={e => dragEnter(e, index, c.taskTypeArchived)}
                                onDragEnd={e => dragEnd(e, c.taskTypeArchived)}
                                onDoubleClick={e => document.getElementById("btnEdit").click()}
                                className="display-task-container archived"
                            >
                                <label style={{fontSize: "18pt"}}>{task.taskName}</label>&nbsp;
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
                <div id="trashBin" 
                    droppable={"true"}
                    onDragEnter={e => dragEnter(e, 0, c.taskTypeDelete)}
                >
                    <img src='/images/trashCan.png' className="ribbon" alt="" />
                    <h2>Task Trash</h2>
                </div>
            </React.Fragment>
        </div>
    );
};

export default List;