import React from 'react';
import '../index.css';
import Home from './home/Home';
import Edit from './edit/Edit';
import { Routes, Route, BrowserRouter  as Router} from 'react-router-dom';

const App = () => {

    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />}/>
                <Route exact path="/edit/:id" element={<Edit />} />
            </Routes>
        </Router>
    );
};

export default App;