import './App.css';
import HomePage from './HomePage';
import ErrorBoundary from './ErrorBoundary';
import React from 'react'

function App() {
  return (
    <div className="App">
           <ErrorBoundary> 
             <HomePage globalValue = "geektrust" />
             </ErrorBoundary>
    </div>
  );
}

export default App;
