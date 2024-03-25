import { classNames, select } from '../settings.js';

class Table {

  constructor() {

    this.dom = {};
    this.phase = [
      ['DRAW ROUTES', 'FINISH DRAWING'],
      ['PICK START', 'ACCEPT START'],
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
    this.finish = [];
    this.draw = [];
    this.solution= [];
    this.getElements();
    this.initGrid();
    this.initButton();
    this.updateDOM();
  }

  cleaningPaths() {
    this.start = [];
    this.finish = [];
    this.draw = [];
    this.solution = [];
  }
  
  getElements() {
    this.dom.finderContainer = document.querySelector(select.containerOf.finder);
    this.dom.message = document.querySelector(select.finder.message);
    this.dom.table = document.querySelector(select.finder.table);
    this.dom.button = document.querySelector(select.finder.button);
  }

  changingPhase(thisTable = this) {

    let moved = thisTable.phase.shift();
    thisTable.phase.push(moved);
    if (moved[0] === 'CALCULATE ROUTE') {
      if (this.draw.length < 2) {
        this.displayError('DRAWN  PATH  TOO SHORT');
        thisTable.phase.unshift(moved);
        return;
      }
      else {
        let analyzed = thisTable.analyzePath();
        thisTable.findShortestPath(analyzed);
        thisTable.showShortest();
      }
    }
    else if (moved[0] === 'DRAW ROUTES') {
      if (this.draw.length < 2) {
        this.displayError('DRAWN  PATH  TOO SHORT');
        thisTable.phase.unshift(moved);
        return;
      }
    } else if (moved[0] === 'PICK START') {
      if (this.start.length === 0) {
        this.displayError('NO  START  POINT');
        thisTable.phase.unshift(moved);
        return;
      }
    } else if (moved[0] === 'PICK FINISH') {
      if (this.finish.length === 0) {
        this.displayError('NO  FINISH  POINT');
        thisTable.phase.unshift(moved);
        return;
      }
    } else if (moved[0] === 'THE BEST ROUTE IS...') {
      thisTable.clearAll();
    }
    thisTable.updateDOM();

  }

  updateDOM() {
    let [message, button] = this.phase[0];
    this.dom.message.innerHTML = message;
    this.dom.message.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    this.dom.button.innerHTML = button;
  }

  showShortest() {
    let highest = Object.keys(this.solution).length - 1;
    for (let i = 0; i <= highest; i++) {
      let step = this.solution[i];
      let toColor = step.join(' ');
      let element = document.getElementById(toColor);
      setTimeout(function () { element.style.backgroundColor = '#78e08f';}, 100*i);
    }

  }

  analyzePath() {
    let currentStep = 0;
    let toCopy = JSON.stringify(this.draw);
    let maze = JSON.parse(toCopy);
    let steps = {};

    steps[currentStep] = [[...this.start[0]]];

    this.removeStep(maze, steps[currentStep][0]);
    let infinity = true;

    while (infinity) {
      if (!steps[currentStep]) {
        this.displayError('NO  PATH  FOUND');
        return;
      }
      let lastSteps = [...steps[currentStep]];
      currentStep++;
      for (let step of lastSteps) {
        let possibilities = this.findPossibilities(step, maze);
        let verifiedPossibilities = this.findRealPossibilities(possibilities, maze);
        for (let possibility of verifiedPossibilities) {
          if (steps[currentStep]) {
            steps[currentStep].push([...possibility]);
          } else {
            steps[currentStep] = [[...possibility]];
          }
          this.removeStep(maze, possibility);

          if (JSON.stringify(possibility) === JSON.stringify(this.finish[0])) {
            infinity = false;
            return steps;
          }
        }
      }
        
    }
  }

  findShortestPath(steps) {
    let highest = Object.keys(steps).length - 1; 
    let shortest = {};
    shortest[highest]=[...this.finish[0]];

    for (let i = highest-1; i > 0; i--) {
      let seeker = [...shortest[i+1]];
      let nextSteps = steps[i];
      for (let step of nextSteps) {
        if (this.areNeighbours(seeker, step)) {
          shortest[i]=[...step];
          break;
        }
      }
    }
    shortest[0] = [...this.start[0]];
    this.solution = shortest;
    return shortest;
  }

  areNeighbours(step1, step2) {
    let rowDiff = step1[0] - step2[0];
    let colDiff = step1[1] - step2[1];
    for (let neighbour of this.neighbours) {
      if (neighbour[0] === rowDiff && neighbour[1] === colDiff) {
        return true;
      }
    }
    return false;
  }

  findRealPossibilities(possibilities, maze) {
    let realPossibilities = [];
    for (let possibility of possibilities) {  
      let verified = JSON.stringify(maze);
      let toCheck = JSON.stringify(possibility);
      if (verified.includes(toCheck)) {
        realPossibilities.push(possibility);
      }
    }
    return realPossibilities;
  }

  findPossibilities(step, maze) {
    console.log(maze);
    let possibilitiesAll = this.createNeighbours(step);
    return possibilitiesAll;
  }

  createNeighbours(step) {
    let crowd = [];
    for (let element of this.neighbours) {
      let neighbour = [...element];
      neighbour[0] += step[0];
      neighbour[1] += step[1];
      crowd.push(neighbour);
    }
    return crowd;
  }

  removeStep(maze, step) {
    let indexToRemove = maze.findIndex(function (array) {
      return JSON.stringify(array) === JSON.stringify(step);
    });
    if (indexToRemove !== -1) {
      maze.splice(indexToRemove, 1);
    }
  }

  clearAll() {
    this.cleaningPaths();
    this.dom.table.innerHTML = '';
    this.fillGrid(this.dom.table);
  }

  proceedClick(coordinates, element) {
    switch (this.phase[0][0]) {
    case 'DRAW ROUTES':
      return this.oneDraw(coordinates,element);
    case 'PICK START':
      return this.pickStart(coordinates, element);
    case 'PICK FINISH':
      return this.pickFinish(coordinates, element);
    case 'CALCULATE ROUTE':
      break;
    case 'THE BEST ROUTE IS...':
      break;
    default:
      alert('Unknown action.');
    }
  }

  oneDraw(coordinates, element) {
    
    if (this.isValidDraw(coordinates)) {
      this.draw.push([...coordinates]);
      element.style.backgroundColor = '#ff6b6b';
      return;
    }     
    element.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  }

  displayError(alertMessage,time=500) {
    let message = this.dom.message;
    message.innerHTML = alertMessage;
    message.style.backgroundColor = '#e55039';
    let that = this;
    setTimeout(function () { that.updateDOM(); }, time);
  }

  pickStart(coordinates, element) {
    if (this.isValidStart(coordinates)) {
      this.clearStart();
      this.start.push([...coordinates]);

      element.style.backgroundColor = '#e55039';
      element.innerHTML = 'S';
      
    } else {
      this.displayError('INVALID  START  CELL');
    }
  }
  pickFinish(coordinates, element) {
    if (this.isValidFinish(coordinates)) {
      this.clearFinish();
      this.finish.push([...coordinates]);

      element.style.backgroundColor = '#e55039';
      element.innerHTML = 'F';
    } else {
      this.displayError('INVALID  FINISH  CELL');
    }
  }

  clearStart() {

    if (this.start.length == 0) {
      return;
    }

    let toClear = this.start.pop().join(' ');
    let element = document.getElementById(toClear);
    element.style.backgroundColor = 'red';
    element.innerHTML = '';
  }

  clearFinish() {

    if (this.finish.length == 0) {
      return;
    }

    let toClear = this.finish.pop().join(' ');
    let element = document.getElementById(toClear);
    element.style.backgroundColor = 'red';
    element.innerHTML = '';
  }

  removeFriend(friend) {
    var indexToRemove = this.draw.findIndex(function (array) {
      return JSON.stringify(array) === JSON.stringify(friend);
    });

    if (indexToRemove !== -1) {
      this.draw.splice(indexToRemove, 1);
    }
  }

  isValidDraw(coordinates) { 

    if (!this.draw.length) {
      return true;
    }

    let friends = JSON.stringify(this.draw);
    let friend = JSON.stringify(coordinates);

    if (friends.includes(friend)) {
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
    this.displayError('INVALID  PATH  CELL');
    return false;
  }

  isValidStart(coordinates) {

    if (this.draw.length<2) {
      return false;
    }
    
    let friends = JSON.stringify(this.draw);
    let friend = JSON.stringify(coordinates);

    if (friends.includes(friend)) {
      return true;
    } else {
      return false;
    }
  }

  isValidFinish(coordinates) {

    if (this.draw.length < 2) {
      return false;
    }

    let start = JSON.stringify(this.start[0]);
    let friends = JSON.stringify(this.draw);
    let friend = JSON.stringify(coordinates);

    if (friends.includes(friend)&&friend!=start) {
      return true;
    } else {
      return false;
    }
  }

  fillGrid(table, side = 10) {
    table.innerHTML = '';
    for (var r = 0; r < side; r++) {
      for (var c = 0; c < side; c++) {
        var gridItem = document.createElement('div');
        var coordinates = `${r} ${c}`;
        gridItem.classList.add('grid-item');
        gridItem.id = coordinates;
        table.appendChild(gridItem);
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
      thisTable.proceedClick(toCheck, event.target);
    });
  }

  initButton() {
    const thisTable = this;
    this.dom.button.addEventListener('click', function (event) {
      event.preventDefault();
      thisTable.changingPhase(thisTable);      
    });
  }

}

export default Table;