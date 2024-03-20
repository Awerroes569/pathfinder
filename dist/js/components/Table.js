//const grid = document.querySelector('.table');
import { classNames, select } from '../settings.js';

class Table {

  constructor() {

    this.dom = {};
    //this.table = document.querySelector('.table');
    this.phase = [
      ['DRAW ROUTES', 'FINISH DRAWING'],
      ['PICK START','ACCEPT START'],
      ['PICK FINISH', 'ACCEPT FINISH'],
      ['CALCULATE ROUTE', 'COMPUTE'],
      ['THE BEST ROUTE IS...', 'START AGAIN']
    ];
    this.neighbours = [
      [-1, 0],   //TOP
      [0, 1],    //RIGHT
      [1, 0],    //DOWN
      [0, -1]    //LEFT
    ];

    this.start = [];
    this.end = [];
    this.draw = [];
    this.getElements();
    this.initGrid();
    this.initButton();
    this.updateDOM();
  }

  getElements() {
    this.dom.finderContainer = document.querySelector(select.containerOf.finder);
    this.dom.message= document.querySelector(select.finder.message);
    this.dom.table = document.querySelector(select.finder.table);
    this.dom.button = document.querySelector(select.finder.button);
    console.log('button',this.dom.button);
  }

  changingPhase(thisTable = this) {
    console.log('changing phase');
    let moved = thisTable.phase.shift();
    thisTable.phase.push(moved);
    thisTable.updateDOM();

  }

  updateDOM() {
    let [message, button] = this.phase[0];
    this.dom.message.innerHTML = message;
    this.dom.button.innerHTML = button;
  }

  proceedClick(coordinates) {
    switch (this.phase[0][0]) {
    case 'DRAW ROUTES':
      console.log('draw');
      return this.oneDraw(coordinates);
    case 'PICK START':
      console.log('start');
      break;
    case 'PICK FINISH':
      console.log('start');
      break;
    case 'CALCULATE ROUTE':
      console.log('start');
      break;
    case 'THE BEST ROUTE IS...':
      console.log('start');
      break;
    default:
      console.log('Unknown action.');
    }
  }

  oneDraw(coordinates) {
    if (this.isValid(coordinates)) {
      this.draw.push([...coordinates]);
      console.log('after push', this.draw);
      return 'red';
    }
    console.log('invalid');
    return 'grey';
  }

  removeFriend(friend) {
    var indexToRemove = this.draw.findIndex(function (array) {
      return JSON.stringify(array) === JSON.stringify(friend);
    });

    // If the index is found (not -1), remove the array
    if (indexToRemove !== -1) {
      this.draw.splice(indexToRemove, 1);
      console.log('removed', this.draw);
    }
  }

  isValid(coordinates) { 

    console.log('conda', !this.draw.length);

    if (!this.draw.length) {
      console.log('no neighbours');
      return true;
    }
    else {
      console.log('neighbours', this.draw);
    }

    let friends = JSON.stringify(this.draw);
    let friend = JSON.stringify(coordinates);

    if (friends.includes(friend)) {
      console.log('friends inside');
      this.removeFriend(coordinates);
      return false;
    }

    for (var element of this.neighbours) {
      let neighbour = [...element];
      neighbour[0] += coordinates[0];
      neighbour[1] += coordinates[1];
      neighbour = JSON.stringify(neighbour);

      if (friends.includes(neighbour)) {
        return true;
      }
    }
    return false;
  }

  fillGrid(table, side = 10) {
    table.innerHTML = '';
    for (var r = 0; r < side; r++) {
      for (var c = 0; c < side; c++) {
        var gridItem = document.createElement('div');
        var coordinates = `${r} ${c}`;
        gridItem.classList.add('grid-item');
        gridItem.id = coordinates;
        //gridItem.innerHTML=coordinates;
        table.appendChild(gridItem);
        //console.log(gridItem);
      }
    }
  }

  initGrid() {
    const thisTable = this;
    this.fillGrid(this.dom.table);

      
    this.dom.table.addEventListener('click', function (event) {
      event.preventDefault();
      if (event.target.className !== classNames.table.gridItem) {
        return;
      }
      let gridItemId = event.target.id;
      let rowcol = gridItemId.split(' ');
      let toCheck = [parseInt(rowcol[0]), parseInt(rowcol[1])];
      //alert(`You produced tocheck ${toCheck}`);
      let checked = thisTable.oneDraw(toCheck);
      console.log('checked', checked);
      if (checked) {
        event.target.style.backgroundColor = checked;
      }
      //event.target.style.backgroundColor = 'blue';
      thisTable.changingPhase(thisTable);
    });

    console.log('LISTENER ADDED');
  }

  initButton() {
    const thisTable = this;
    this.dom.button.addEventListener('click', function (event) {
      event.preventDefault();
      thisTable.changingPhase(thisTable);
      console.log('button clicked');
      
    });
  }

}

export default Table;