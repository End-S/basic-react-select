import React, { Component } from 'react';
import RSelect from './r-select/r-select.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <RSelect
          optionList={['England', 'Wales', 'Scotland', 'Northen Ireland']}
          selectedOption='England'
        ></RSelect>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <RSelect optionList={['test', 'test1', 'test2']}></RSelect>
      </div>
    );
  }
}

export default App;
