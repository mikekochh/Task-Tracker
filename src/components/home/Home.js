import '../../App.css';
import Header from '../Header';
import TextBox from './TextBox';
import List from './List';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import * as c from '../../Main';

function Home() {

  const [activeTaskList, updateActiveTaskList] = useState(() => {
    return JSON.parse(localStorage.getItem(c.LOCAL_STORAGE_KEY_ACTIVE))
  });

  const [completedTaskList, updateCompletedTaskList] = useState(() => {
    return JSON.parse(localStorage.getItem(c.LOCAL_STORAGE_KEY_COMPLETED)) || []
  });

  const [archivedTaskList, updateArchivedTaskList] = useState(() => {
    return JSON.parse(localStorage.getItem(c.LOCAL_STORAGE_KEY_ARCHIVED)) || []
  });

  useEffect(() => {
    localStorage.setItem(c.LOCAL_STORAGE_KEY_ACTIVE, JSON.stringify(activeTaskList));
  }, [activeTaskList]);

  useEffect(() => {
    localStorage.setItem(c.LOCAL_STORAGE_KEY_COMPLETED, JSON.stringify(completedTaskList));
  }, [completedTaskList]);

  useEffect(() => {
    localStorage.setItem(c.LOCAL_STORAGE_KEY_ARCHIVED, JSON.stringify(archivedTaskList));
  }, [archivedTaskList]);

  const addTask = (taskName) => {
    let newTaskList = [...activeTaskList];
    newTaskList.push({
      taskName: taskName,
      id: v4(),
      isDragging: false
    });

    updateActiveTaskList(newTaskList);
  }

  const moveAllToArchived = () => {
    let newArchivedTaskList = [...archivedTaskList];
    activeTaskList.forEach(task => {
      newArchivedTaskList.push({
        taskName: task.taskName,
        id: task.id,
        isDragging: false
      });
    });
    updateActiveTaskList([]);
    updateArchivedTaskList(newArchivedTaskList);
  }

  const moveAllToCompleted = () => {
    let newCompletedTaskList = [...completedTaskList];
    activeTaskList.forEach(task => {
      newCompletedTaskList.push({
        taskName: task.taskName,
        id: task.id,
        isDragging: false
      });
    });
    updateActiveTaskList([]);
    updateCompletedTaskList(newCompletedTaskList);
  }

  return (
    <div>
      <Header />
      <TextBox addTask={addTask}
        moveAllToArchived={moveAllToArchived}
        moveAllToCompleted={moveAllToCompleted}
      />
      <br></br>
      <br></br>
      <br></br>
      <List activeTaskList={activeTaskList}
        completedTaskList={completedTaskList}
        archivedTaskList={archivedTaskList}
        updateActiveTaskList={updateActiveTaskList}
        updateCompletedTaskList={updateCompletedTaskList}
        updateArchivedTaskList={updateArchivedTaskList}
      />
      <br></br>
      <br></br>
      <br></br>
    </div>

  );
}

export default Home;
