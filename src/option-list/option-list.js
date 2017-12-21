import React, {Component} from 'react';
import './option-list.css';

class OptionList extends Component {
   constructor(props) {
      super(props);
      this.state = {
         mouseHighlight: {},
         keyboardHighlight: this.props.selectedOption ? this.props.selectedOption : {index: -1, label: ''}
      };
      this.currentIndex = this.props.selectedOption ? this.props.selectedOption.index : -1;
      // keeps hold of the time left before lookup resets
      this.lookupResetTimer = undefined;
      // keeps track of the current matches
      this.matchStore = undefined;
      // holds the term typed in for lookup
      this.matchTermBuilder = '';
      // where we are when iterating over the matchStore
      this.matchIteratorValue = 0;
   }

   /**
    * *~*~*~*~*
    * LIFECYCLE
    * *~*~*~*~*
    */

   componentWillMount = () => {
      // Add listners for keydown and keypess
      document.addEventListener('keydown', this.handleKeyDown);
      document.addEventListener('keypress', this.onKeyPress);
   }

   componentDidMount = () => {
      if (this.currentIndex > -1) {
         // if the initial option is out of view, position the list so that it isn't
         if (!this.checkInView(this.optionListRef, this.currentIndex)) {
            this.jumpToOption(this.currentIndex);
         }
      }
   }

   componentWillUnmount = () => {
      // Remove listners for keydown and keypess
      document.removeEventListener('keydown', this.handleKeyDown);
      document.removeEventListener('keypress', this.onKeyPress);
   }

   /**
    * *~*~*~*~*
    * FUNCTIONS
    * *~*~*~*~*
    */

      // Passes valid key presses to it's related function
   handleKeyDown = (event) => {
      const scrollElement = this.optionListRef;

      // bail if options list is undefined or empty
      if (!this.props.options || this.props.options.length === 0) {
         return;
      }

      switch (event.key) {
         // UP ARROW
         case 'ArrowUp':
            event.preventDefault();
            this.handleArrowUp(scrollElement);
            break;
         // DOWN ARROW
         case 'ArrowDown':
            event.preventDefault();
            this.handleArrowDown(scrollElement);
            break;
         // RETURN KEY
         case 'Enter':
            this.handleReturnKey();
            break;
         // TAB KEY
         case 'Tab':
            this.handleTabKey();
            break;
         // DEFAULT
         default:
            break;
      }
      // user may have scrolled away from the highlight, bring it back into view
      if (this.currentIndex >= 0 && !this.checkInView(scrollElement, this.currentIndex)) {
         this.jumpToOption(this.currentIndex);
      }
   }

   //Handles navigation up the option list
   handleArrowUp = (scrollElement) => {
      // remove highlight if at the minimum bound and perform early exit
      if (this.currentIndex === 0 || this.currentIndex === -1) {
         this.resetNavigation();
         return;
      }
      // set highlight to one above
      this.setState({
         keyboardHighlight: this.props.options[--this.currentIndex]
      })
      if (!this.checkInView(scrollElement, this.currentIndex)) {
         // scroll up if selected item is not in view
         scrollElement.scrollTop -= scrollElement.children[this.currentIndex].clientHeight;
      }
   }

   //Handles navigation down the option list
   handleArrowDown = (scrollElement) => {
      // early exit if bottom option is highlighted
      if (this.state.keyboardHighlight.index === this.props.options.length - 1) {
         return;
      }
      // set highlight to option below
      this.setState({
         keyboardHighlight: this.props.options[++this.currentIndex]
      })
      if (!this.checkInView(scrollElement, this.currentIndex)) {
         // scroll down if selected item is not in view
         scrollElement.scrollTop += scrollElement.children[this.currentIndex].clientHeight;
      }
   }

   // Handles return key press on a highlighted option
   handleReturnKey = () => {
      // skip if we have not highlighted an option
      if (this.currentIndex !== -1) {
         // choose selected option
         this.selectOption(this.state.keyboardHighlight);
      }
   }

   //Handles tab key press
   handleTabKey = () => {
      // if there is an active highlight selected it
      if (this.state.keyboardHighlight.index >= 0) {
         this.selectOption(this.state.keyboardHighlight);
      } else {
         this.selectOption({index: -1, label: ''})
      }
   }

   // Handles alphanumeric key presses
   onKeyPress = (event) => {
      if (!event.key.match(/^[ A-Za-z0-9_@./#&+-=*'{}()]$/)) {
         // reject anything that is not alphanumeric or an accepted symbol
         return;
      }
      this.lookup(event);
   }

   // Performs lookup with alphanumeric character
   lookup = (event) => {
      window.clearTimeout(this.lookupResetTimer);
      event.preventDefault();
      // bail if options list is undefined or empty
      if (!this.props.options || this.props.options.length === 0) {
         return;
      }

      // init matchStore if undefined or empty
      if (this.matchStore === undefined || this.matchStore.length === 0) {
         this.matchStore = this.props.options
      }
      // start concatenating key presses
      this.matchTermBuilder += event.key
      // get the first item in the list of matches
      const firstListItem = this.matchStore[0].label;

      // if the search term is repeating the same character more than once in a row e.g. 'aaaa'
      if (
         this.matchTermBuilder.match(/^(.)\1+$/) && // regex matching a repeating char
         this.matchTermBuilder.charAt(0).toLowerCase() === // and make sure the repeating char matches the first char
         firstListItem.charAt(0).toLowerCase()
      ) {
         // cycle over the previously matched options
         if (++this.matchIteratorValue >= this.matchStore.length) {
            this.matchIteratorValue = 0 // loop back to the start
         }
         this.jumpToOption(this.matchStore[this.matchIteratorValue].index);
         // start time out for lookup reset
         this.lookupResetTimer = window.setTimeout(this.clearMatchBuilder, 1000);
      } else { // characters are not repeating, perform search with current term
         const newMatches = []; // temporary store
         for (let i = 0; i < this.matchStore.length; i++) {
            // get value we are matching on
            const listItem = this.matchStore[i].label;
            if (
               listItem
                  .substring(0, this.matchTermBuilder.length) // run comparision only on length of current match term
                  .toLowerCase() ===
               this.matchTermBuilder.toLowerCase()
            ) {
               // if we match a search add it to the newMatches array
               newMatches.push(this.matchStore[i]);
            }
         }
         if (newMatches.length > 0) {
            // matches were made, copy them to the matchStore
            this.matchStore = newMatches;
            // jump to the first match
            this.jumpToOption(this.matchStore[0].index);
         }
         // reset position in the list of current matches to 0
         this.matchIteratorValue = 0;
         // start time out for lookup reset
         this.lookupResetTimer = window.setTimeout(this.clearMatchBuilder, 1000);
      }
   }

   // Resets to default lookup functionality
   clearMatchBuilder = () => {
      this.matchStore = undefined;
      this.matchTermBuilder = '';
      this.matchIteratorValue = 0;
   }

   // Jumps to the given option, putting it in view
   jumpToOption = (optionIndex) => {
      const matchedOption = this.optionListRef.children[optionIndex];
      this.currentIndex = optionIndex;
      this.setState({keyboardHighlight: this.props.options[optionIndex]})
      // make sure the matchedOption is visible in the scroll list
      this.optionListRef.scrollTop = matchedOption.offsetTop;
   }

   // Returns true if option is 100% in view
   checkInView = (container, childIndex) => {
      // get number of pixels scrolled vertically:
      const containerTop = container.scrollTop;
      // find the bottom of the visible area
      const containerBottom = containerTop + container.offsetHeight;

      // get the element of the currently highlighted item in the list
      const listElem = container.children[childIndex];

      // get the elements distance from the top of the scroll bar
      const listElemTop = listElem.offsetTop;
      // get the elements bottom relative to the scroll bar
      const listElemBottom = listElemTop + listElem.offsetHeight;

      // if elements top is within the scroll bars visible area then it is inView
      const inView = (listElemTop >= containerTop && listElemBottom <= containerBottom);
      return inView;
   }

   // Reset option highlighting
   resetNavigation = () => {
      this.currentIndex = -1
      this.setState({keyboardHighlight: {index: -1, label: ''}, mouseHighlight: {}})
      this.optionListRef.scrollTop = 0;
   }

   // Propogate selected option to parent
   selectOption = (option) => {
      this.props.onOptionSelection(option);
   }

   // Mouse hover uses separate highlight
   setMouseHighlight = (option) => {
      this.setState({mouseHighlight: option});
   }

   /**
    * *~*~*~*~*
    * RENDER
    * *~*~*~*~*
    */

   render() {
      return (
         <div className="option-container" ref={r => this.optionListRef = r}>
            {this.props.options.map(option =>
               <div
                  key={option.label.toString()}
                  className={'option'
                  + (this.state.keyboardHighlight.index === option.index ? ' option-keyboard-highlight' : '')
                  + (this.state.mouseHighlight.index === option.index ? ' option-mouse-highlight' : '')}
                  onClick={() => this.selectOption(option)}
                  onMouseEnter={() => this.setMouseHighlight(option)}
                  onMouseLeave={() => this.setMouseHighlight({index: -1, label: ''})}>
                  {option.label}
               </div>)}
         </div>
      )

   }
}

export default OptionList;
