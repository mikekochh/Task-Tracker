import React, { useRef } from 'react';
import * as c from '../../Main';

const TrashSection = (props) => {

    const functions = props.trashSectionFunctions;
    

    return (
        <div id="taskSectionDeleted"
            className='task-container-border'
            droppable={'true'}
            onDragEnter={e => functions.dragEnter(0, c.taskTypeDelete)}
            onDragOver={e => functions.dragOverTaskSection(e, c.taskTypeDelete)}
            onDragLeave={e => functions.exitTaskSections()}
        >
            <img src='/images/trashCan.png' alt="" />
            <h2>Task Trash</h2>
        </div>
    )
}

export default TrashSection;