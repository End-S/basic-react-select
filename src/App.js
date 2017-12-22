import React, {Component} from 'react';
import RBSelect from './r-select/r-select.js';
import './App.css';

import Highlight from "react-syntax-highlight";
import "highlight.js/styles/xcode.css";

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         selectedCountry: '',
         selectedForna: ''
      };
   }

   onChange = (event) => {
      const controlName = event.target.name;
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
               <p>A basic custom select that behaves in a similar fashion to the HTML select control.</p>
               <p className='selected-option-display'> Selected country: {this.state.selectedCountry}</p>
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
                     <li><span className='required-prop'>name</span> - the name of the control</li>
                     <li><span className='required-prop'>optionList</span> - the list of available options</li>
                     <li><span className='required-prop'>emitSelection</span> - invoked when a value is selected</li>
                     <li>className - optional styling</li>
                     <li>label - optional label to appear above the select control</li>
                  </ul>
               </p>
               <p className='selected-option-display'> Selected forna: {this.state.selectedForna}</p>
               <RBSelect
                  name='selectedForna'
                  className='select-box'
                  label='Flora'
                  optionList={flora}
                  emitSelection={this.onChange}
               ></RBSelect>
               <p>The object emitted is in the format:</p>
               <Highlight className='code-snippit' lang={'javascript'}
                          value={"{ selectedOption: 'String', target: {name:'String'}}"}/>
               <p>The select responds to keyboard navigation. Press return to open and select a result, esc to close
                  and up or down to navigate the list. Whilst the list is open it is possible to perform
                  primitive
                  character matching, e.g. pressing 'c' will highlight the first result that begins with c.
               </p>
            </div>
            <div className="footer-area">
               <span className="footer-text">By <a href='http://rrayns.co.uk' target='_blank'
                                                                    rel='noreferrer noopener'>Robert Raynsford</a></span>
            </div>
         </div>
      );
   }
}

export default App;
