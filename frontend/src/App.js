import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";

import Main from "./components/Main";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Main/>
      </Router>
    </div>
  );
}

export default App;
