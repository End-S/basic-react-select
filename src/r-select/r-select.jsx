import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import OptionList from '../option-list/option-list';
import './r-select-style.css';

function OptionItem(index, label) {
  this.index = index;
  this.label = label;
}

class RBSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [], // holds array of select options
      hideOptionList: true, // option list visible or hidden
      selectedOption: new OptionItem(-1, ''), // the currently selected option
      label: '', // label to appear above select
    };
  }

   /**
    * *~*~*~*~*
    * LIFECYCLE
    * *~*~*~*~*
    */

   componentWillMount = () => {
     const selectSetup = {};
     selectSetup.options = [];
     this.props.optionList.forEach((option, i) => {
       selectSetup.options.push(new OptionItem(i, option.toString()));
     });

     if (this.props.selectedOption) {
       const preSelectedOptionIndex = selectSetup
         .options
         .findIndex(option => option.label === this.props.selectedOption);
       selectSetup.selectedOption = selectSetup.options[preSelectedOptionIndex];
       this.emitSelection(selectSetup.selectedOption);
     }

     if (this.props.label) {
       selectSetup.label = this.props.label;
     }

     this.setState(selectSetup);
   }

   componentDidUpdate = () => {
     if (this.state.hideOptionList) {
       // remove click listener if list is no longer showing
       document.removeEventListener('click', this.handleClick);
     } else {
       // add listner for click events
       document.addEventListener('click', this.handleClick);
     }
   }

   /**
    * *~*~*~*~*
    * FUNCTIONS
    * *~*~*~*~*
    */

  // Add listener for keydown events when component has focus
   hasFocus = () => {
     document.addEventListener('keydown', this.handleKeyDown);
   }

   // Remove listener for keydown events when component blurs
   handleBlur = () => {
     document.removeEventListener('keydown', this.handleKeyDown);
   }

   // Handles open/close with enter or escape key press
   handleKeyDown = (event) => {
     if (event.key === 'Enter' && this.state.hideOptionList) {
       this.hideOptionList(false);
     } else if (event.key === 'Escape') {
       this.hideOptionList(true);
     }
   }

   // Hides option list if click occurs outside component
   handleClick = (event) => {
     if (!this.selectRef.contains(event.target)) {
       this.hideOptionList(true);
       document.removeEventListener('click', this.handleClick);
     }
   }

   // Toggles the option list to show or hide
   hideOptionList = (newState) => {
     this.setState({ hideOptionList: newState });
   }

   // Callback when an Option is chosen in the list
   handleOptionSelection = (option) => {
     // close option list
     this.hideOptionList(true);
     // update selected option
     this.setState({ selectedOption: option });
     // set focus back to the select input
     this.inputRef.focus();
     this.emitSelection(option);
   }

   // emits selected option and name of this control
   emitSelection = (option) => {
     this.props.emitSelection({ selectedOption: option.label, target: { name: this.props.name } });
   }

   /**
    * *~*~*~*~*
    * RENDER
    * *~*~*~*~*
    */

   render() {
     return (
       <div
         onBlur={this.handleBlur}
         className={`select-container ${this.props.className}`}
         ref={(r) => { this.selectRef = r; }}
       >
         <label className="select-label">{this.state.label}</label>
         <div className="icon" />
         <input
           readOnly
           className="select-block"
           ref={(r) => { this.inputRef = r; }}
           onFocus={this.hasFocus}
           onClick={() => this.hideOptionList(!this.state.hideOptionList)}
           value={this.state.selectedOption.label}
         />
         {this.state.hideOptionList ? (
               null
            ) : (
              <OptionList
                options={this.state.options}
                onOptionSelection={this.handleOptionSelection}
                hidden={this.state.hideOptionList}
                selectedOption={this.state.selectedOption}
              />
            )
            }
       </div>
     );
   }
}

RBSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  optionList: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  emitSelection: PropTypes.func.isRequired,
  className: PropTypes.string,
};

RBSelect.defaultProps = {
  label: '',
  selectedOption: null,
  className: '',
};

export default RBSelect;
