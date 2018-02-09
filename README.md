## Basic React Select
This project was created as a learning exercise

## About
A basic custom select that behaves in a similar fashion to the HTML select control.
It has the following props:

- name - the name of the control
- optionList - the list of available options
- emitSelection - invoked when a value is selected
- className - optional styling
- label - optional label to appear above the select control

The object emitted from emitSelection is in the format:
{ selectedOption: 'String', target: {name:'String'}}

The select responds to keyboard navigation. Press return to open and select a result, esc to close and up or down to navigate the list. Whilst the list is open it is possible to perform primitive character matching, e.g. pressing 'c' will highlight the first result that begins with c.
