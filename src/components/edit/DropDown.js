import React from 'react';
import DropdownItem from './DropdownItem';

const DropDown = (props) => {
    return (
        <div>
            <div>
                <button>Click Me</button>
            </div>
            <div className='dropdown-menu'>
                <ul>
                    <DropdownItem />
                    <DropdownItem />
                    <DropdownItem />
                </ul>
            </div>
        </div>
    )
}

export default DropDown;