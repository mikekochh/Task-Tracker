import React, { useRef } from 'react';
import * as c from '../../Main';

const TaskListItem = (props) => {

    const functions = props.taskListItemFunctions;

    let taskInputID = useRef();

    const setTaskClassList = () => {
        return "display-task-container draggable " + c.getTaskTypeName(props.taskTypeID);
    }

    const setID = (index, type) => {
        if (type === "txtArea") {
            taskInputID.current = type + c.getTaskTypeNameTitleCase(props.taskTypeID) + "Task" + index;
        }
        return type + c.getTaskTypeNameTitleCase(props.taskTypeID) + "Task" + index;
    }

    const updateTaskName = (e) => {
        if (e.keyCode === 13) {
            const newTaskName = document.getElementById(taskInputID.current).value;
            functions.updateTaskName(newTaskName, props.index, props.taskTypeID);
            functions.doneEditingTaskName(props.index, props.taskTypeID);
        } 
    }

    const addAutoResize = () => {
        document.querySelectorAll('[data-autoresize]').forEach(function (element) {
          element.style.boxSizing = 'border-box';
          var offset = element.offsetHeight - element.clientHeight;
          element.addEventListener('input', function (event) {
            event.target.style.height = 'auto';
            event.target.style.height = event.target.scrollHeight + offset + 'px';
          });
          element.removeAttribute('data-autoresize');
        });
    }

    return (
        <div>
            <div key={props.task.id}
                        id={setID(props.index, "div")}
                        draggable={"true"}
                        droppable={"true"}
                        onDragStart={e => functions.dragStart(props.index)}
                        onDragEnter={e => functions.dragEnter(props.index, props.taskTypeID)}
                        onDragEnd={e => functions.dragEnd(props.taskTypeID)}
                        onDoubleClick={e => functions.taskDoubleClick(props.index, props.taskTypeID)}
                        onKeyUp={e => updateTaskName(e)}
                        className={setTaskClassList()}
            >
                <label id={setID(props.index, "title")} 
                    style={{fontSize: "20pt", display: "none"}}
                    index={props.index}
                    taskTypeID={props.taskTypeID}>
                    Edit Task: 
                </label>
                <textarea 
                    id={setID(props.index, "txtArea")} 
                    style={{fontSize: "18pt", display: "none"}}
                    defaultValue={props.task.taskName}
                    index={props.index}
                    taskTypeID={props.taskTypeID}
                    data-autoresize
                     />
                <label id={setID(props.index, "lbl")} className="display-task-label">{props.task.taskName}</label>&nbsp;
            </div>
        </div>
    )
}

export default TaskListItem;