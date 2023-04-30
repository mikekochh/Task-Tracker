import React from 'react';
import CancelEdit from './CancelEdit';

const TextBoxEdit = (props) => {

    const update = () => {
        const newTaskName = document.getElementById("taskNameInput").value;
        if (newTaskName === "") {
            alert("Task name is mandatory bitch!!!!");
            return;
        }
        props.updateTask(newTaskName);
    }

    return (
        <div style={{textAlign: "center"}}>
            <div className="ui main" style={{display: "flex", textAlign: "center", justifyContent:"center"}}>
                <input 
                    type="text" 
                    name="task" 
                    id="taskNameInput"
                    value={props.selectedTask.taskName}
                    style={{width: "400px"}}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            update();
                            document.getElementById("idLink").click();
                        }
                    }}>
                    </input>&nbsp;
                    <a href={'/'}>
                        <button onClick={() => { update() }} id="idLink" className="green-button">SAVE</button>    
                    </a>&nbsp;
                    <CancelEdit />
            </div>
            
        </div>
    )
}

export default TextBoxEdit;