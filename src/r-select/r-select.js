import React, { Component } from 'react';
import OptionList from '../option-list/option-list.js';
import './r-select-style.css'

function OptionItem(index, label) {
	  this.index = index;
	  this.label = label;
}

class RSelect extends Component {
  constructor(props) {
     super(props);
     // state properties - holds array of select options
     this.state = {
        options: [new OptionItem(0,'Green Grass'), new OptionItem(1,'Lemon Grass'), new OptionItem(2, 'Mint Grass'), new OptionItem(3, 'Blue Grass'), new OptionItem(4, 'Burnt Grass'), new OptionItem(5, 'Long Grass')],
        hideOptionList: true,
        selectedOption: new OptionItem(-1, '')
     };

		 super(props);
	 [
		 'componentWillMount',
		 'componentDidUpdate',
		 'hideOptionList',
		 'handleOptionSelection',
		 'hasFocus',
		 'handleClick',
		 'handleKeyDown',
		 'handleBlur',
	 ].forEach((fn) => this[fn] = this[fn].bind(this));
  }


	//    _ _  __                      _
	//   | (_)/ _| ___  ___ _   _  ___| | ___
	//   | | | |_ / _ \/ __| | | |/ __| |/ _ \
	//   | | |  _|  __| (__| |_| | (__| |  __/
	//   |_|_|_|  \___|\___|\__, |\___|_|\___|
	//                      |___/

	componentWillMount() {
		const newOptions = [];
		this.props.optionList.forEach( (option, i) => {
			newOptions.push(new OptionItem(i, option.toString()))
		})
		this.setState({options: newOptions})
  }

	componentDidUpdate() {
		if(this.state.hideOptionList) {
			// remove click listener if list is no longer showing
			document.removeEventListener('click', this.handleClick);
		} else {
			// add listner for click events
			document.addEventListener('click', this.handleClick);
		}
	}

	//     __                  _   _
	//    / _|_   _ _ __   ___| |_(_) ___  _ __  ___
	//   | |_| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
	//   |  _| |_| | | | | (__| |_| | (_) | | | \__ \
	//   |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
	//

	hasFocus() {
		document.addEventListener('keydown', this.handleKeyDown);
	}

	handleBlur(){
		// remove the key listener
		document.removeEventListener('keydown', this.handleKeyDown);
	}

	handleKeyDown(event) {
			if(event.key==='Enter' && this.state.hideOptionList){
				this.hideOptionList(false);
			} else if (event.key === 'Escape') {
				this.hideOptionList(true);
			}
			// focus should not go to option list unless it has a highlight or down is pressed
		}

		handleClick(event) {
			if(!this.selectRef.contains(event.target)) {
				this.hideOptionList(true);
				document.removeEventListener('click', this.handleClick);
			}
		}

  // Toggles the option list to show or hide
  hideOptionList(newState) {
    this.setState({hideOptionList: newState});

  }

  // Callback when an Option is chosen in the list
  handleOptionSelection(option) {
	  // close option list
	  this.hideOptionList(true);
	  // update selected option
	  this.setState({selectedOption: option});
		// set focus back to the select input
		this.inputRef.focus();
  }


	//    _                       _       _
	//   | |_ ___ _ __ ___  _ __ | | __ _| |_ ___
	//   | __/ _ | '_ ` _ \| '_ \| |/ _` | __/ _ \
	//   | ||  __| | | | | | |_) | | (_| | ||  __/
	//    \__\___|_| |_| |_| .__/|_|\__,_|\__\___|
	//                     |_|

  render() {
    let optionList;
    return (
      <div onBlur={this.handleBlur} className="select-container" ref = { r => this.selectRef = r } >
        <input
					readOnly
					className="select-block"
					ref = { r => this.inputRef = r}
					onFocus={this.hasFocus}
					onClick={() => this.hideOptionList(!this.state.hideOptionList)}
					value={this.state.selectedOption.label}/>
				{this.state.hideOptionList ? (
				null
			) : (
				<OptionList
					options={this.state.options}
					onOptionSelection={this.handleOptionSelection}
					hidden={this.state.hideOptionList}
					selectedOption={this.state.selectedOption}>
				</OptionList>
				)
		}
      </div>
    );
  }
}

export default RSelect;
