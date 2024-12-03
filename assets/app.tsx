import React from 'react';
import ReactDOM from 'react-dom';
import './styles/app.css'; 

const App = () => {
    return (
        <div>
            <h1>Hello Symfony + React!</h1>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
