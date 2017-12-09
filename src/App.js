import React, { Component } from 'react';
import RBSelect from './r-select/r-select.js';
import './App.css';

class App extends Component {
  constructor(props) {
     super(props);
     this.state = {
        selectedCountry: '',
        selectedForna: ''
     };
  }

  onChange = (event) => {
    const controlName = event.name;
    const controlValue = event.selectedOption;
    this.setState({[controlName]: controlValue})
  }

  render() {
    const unitedKingdom = ['England', 'Wales', 'Scotland', 'Northen Ireland'];
    const flora = [
      'Achillea millefolium', 'Aegopodium podagraria', 'Calystegia silvatica', 'Carex humilis',
      'Inula crithmoides', 'Isoetes echinospora', 'Tamarix africana'];


    return (
      <div className='container'>
        <div className='header-area'>
          Basic React Select
        </div>
        <div className='content-area'>
          <p>A basic custom select that behaviour similar fashion to the HTML select control. It responds to
          typical key navigation, press return to open, esc to close, up or down to navigate the list.</p>
          <p> Selected country: {this.state.selectedCountry}</p>
          <RBSelect
            name='selectedCountry'
            className='select-box'
            label='United Kingdom'
            optionList={unitedKingdom}
            selectedOption='England'
            emitSelection={this.onChange}
          ></RBSelect>
          <p>It has the following props:
          <ul>
            <li>name - the controls name</li>
            <li>className - optional styling</li>
            <li>label - optional label to appear above select</li>
            <li>optionList - the list of avaliable options to appear when the select expands</li>
            <li>emitSelection - emit handling for the selected value</li>
          </ul>
          </p>
          <p> Selected forna: {this.state.selectedForna}</p>
          <RBSelect
            name='selectedForna'
            className='select-box'
            label='Flora'
            optionList={flora}
            emitSelection={this.onChange}
          ></RBSelect>
        </div>
        <div className="footer-area">
          <span className="footer-text">By Robert Raynsford <a href='http://rrayns.co.uk' target='_blank' rel='noreferrer noopener'>rrayns.co.uk</a></span>
        </div>
      </div>
    );
  }
}

export default App;
