import React, {useEffect, useState} from 'react';
import TextBoxEdit from './TextBoxEdit';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import * as c from '../../Constants';

const Edit = () => {

    const [activeTaskList, updateActiveTaskList] = useState(() => {
        return JSON.parse(localStorage.getItem(c.LOCAL_STORAGE_KEY_ACTIVE));
    })
    
    useEffect(() => {
        localStorage.setItem(c.LOCAL_STORAGE_KEY_ACTIVE, JSON.stringify(activeTaskList));
    }, [activeTaskList]);

    const params = useParams();
    const selectedTask = activeTaskList.find(x => x.id === params.id);

    const updateTask = (newTaskName) => {
        const index = activeTaskList.findIndex(task => task.id === params.id);
        const updatedTaskList = [...activeTaskList];
        updatedTaskList[index].taskName = newTaskName;
        updateActiveTaskList(updatedTaskList);
    }

    return (
        <div style={{textAlign: "center"}}>
            <Header titleName="EDIT TASK" />
            <TextBoxEdit selectedTask={selectedTask} updateTask={updateTask} />
        </div>
    );
}

export default Edit;