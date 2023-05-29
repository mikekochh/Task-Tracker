import React, { useRef } from 'react';
import * as c from '../../Main';
import TaskListItem from './TaskListItem';

const TaskListSection = (props) => {

    const functions = props.taskListSectionFunctions;

    let taskTypeID = useRef();
    let taskSectionDivID = useRef();
    let taskTitle = useRef();


    const setGlobalVariables = () => {
        taskTypeID.current = props.taskTypeID;

        switch (taskTypeID.current) {
            case 0:
                taskSectionDivID.current = "taskSectionActive";
                taskTitle.current = "ACTIVE TASKS";
                break;
            case 1:
                taskSectionDivID.current = "taskSectionCompleted";
                taskTitle.current = "COMPLETED TASKS";
                break;
            case 2:
                taskSectionDivID.current = "taskSectionArchived";
                taskTitle.current = "ARCHIVED TASKS";
                break;
            default:
                taskSectionDivID.current = "taskSectionDeleted";
                break;
        }
    }

    setGlobalVariables();

    const setHeaderClassList = () => {
        return "display-task-title draggable " + c.getTaskTypeName(taskTypeID.current);
    }

    return (
        <div>
            <div className="task-container-border"
                            id={taskSectionDivID.current} 
                            onDragOver={e => functions.dragOverTaskSection(e, taskTypeID.current)}
                            onDragEnter={e => functions.dragEnter(0, taskTypeID.current)}
                            onDragLeave={e => functions.exitTaskSections()}
            >
                <br></br>
                <h2 draggable={"true"}
                            droppable={"true"}
                            className={setHeaderClassList()}
                            onDragStart={e => functions.dragStartTitle(taskTypeID.current)}
                            onDragEnd={e => functions.dragEndTitle()}
                >
                    {taskTitle.current}
                </h2>
                <br></br>
                <div className="tasks-container">
                    {props.taskList.length > 0 && props.taskList.map((task, index) => 
                        <TaskListItem task={task}
                                    index={index}
                                    taskTypeID={taskTypeID.current}
                                    taskListItemFunctions={props.taskListItemFunctions}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskListSection;