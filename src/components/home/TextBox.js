import React from 'react';

const TextBox = (props) => {

    const add = () => {
        const newTaskName = document.getElementById("taskNameInput").value;
        if (newTaskName === "") {
            alert("Task name is mandatory bitch!!!!");
            return;
        }
        props.addTask(newTaskName);
        clearTaskInput();
    }

    const clearTaskInput = () => {
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
                onClick={() => { add() }} >
                +
            </button>
            <button 
                onClick={() => clearTaskInput()} 
                className="add-task-button"
            >
                CLEAR
            </button>&nbsp;
                <br></br>
        </div>
    );
};

export default TextBox;