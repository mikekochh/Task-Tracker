import React from 'react';
import '../index.css';
import Home from './home/Home';
import { Routes, Route, BrowserRouter  as Router} from 'react-router-dom';

const App = () => {

    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />}/>
            </Routes>
        </Router>
    );
};

export default App;