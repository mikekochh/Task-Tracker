import React from 'react';

const TextBox = (props) => {

    const add = () => {
        const newTaskName = document.getElementById("taskNameInput").value;
        if (newTaskName === "") {
            alert("Task name is mandatory bitch!!!!");
            return;
        }
        props.addTask(newTaskName);
        document.getElementById("taskNameInput").value = "";
    }

    return (
        <div className="ui main" style={{textAlign: "center"}}>
            <input 
                className='new-task-container active'
                type="text" 
                name="task" 
                id="taskNameInput"
                placeholder='Add New'
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        add();
                    }
                }}
                style={{width: "400px"}} />
            <button 
                className="add-task-button" 
                id="btnAdd" 
                onClick={() => { add() }} >+</button>&nbsp;
                <br></br>
            {/* <button className="red-button" onClick={props.moveAllToArchived}>All Archived</button>&nbsp;
            <button className="gold-button" onClick={props.moveAllToCompleted}>All Completed</button> */}
        </div>
    );
};

export default TextBox;