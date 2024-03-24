//const grid = document.querySelector('.table');
import { classNames, select } from '../settings.js';

class Table {

  constructor() {

    this.dom = {};
    //this.table = document.querySelector('.table');
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
    console.log('button', this.dom.button);
  }

  changingPhase(thisTable = this) {
    console.log('changing phase');
    let moved = thisTable.phase.shift();
    thisTable.phase.push(moved);
    if (moved[0] === 'CALCULATE ROUTE') {
      let analyzed = thisTable.analyzePath();
      console.log('ANALYZED', analyzed);  
      thisTable.findShortestPath(analyzed);
      thisTable.showShortest();
    } else if (moved[0] === 'THE BEST ROUTE IS...') {
      thisTable.clearAll();
    }
    thisTable.updateDOM();

  }

  updateDOM() {
    let [message, button] = this.phase[0];
    this.dom.message.innerHTML = message;
    this.dom.button.innerHTML = button;
  }

  showShortest() {
    console.log('showing shortest');
    let highest = Object.keys(this.solution).length - 1;
    for (let i = 0; i <= highest; i++) {
      let step = this.solution[i];
      let toColor = step.join(' ');
      let element = document.getElementById(toColor);
      setTimeout( function() {element.style.backgroundColor = 'green';}, 100*i);
      //element.style.backgroundColor = 'green';
    }

  }

  analyzePath() {
    let currentStep = 0;
    let toCopy = JSON.stringify(this.draw);
    let maze = JSON.parse(toCopy);
    let steps = {};

    //INIT START
    steps[currentStep] = [[...this.start[0]]];

    this.removeStep(maze, steps[currentStep][0]);
    let infinity = true;

    while (infinity) {
      let lastSteps = [...steps[currentStep]];
      currentStep++;
      for (let step of lastSteps) {
        let possibilities = this.findPossibilities(step, maze);
        console.log('possibilities inside Analyze', possibilities);
        let verifiedPossibilities = this.findRealPossibilities(possibilities, maze);
        console.log('verified possibilities', verifiedPossibilities);
        for (let possibility of verifiedPossibilities) {
          console.log('working possibility', possibility);
          if (steps[currentStep]) {
            steps[currentStep].push([...possibility]);
          } else {
            steps[currentStep] = [[...possibility]];
            console.log('added step', steps[currentStep]);
          }
          this.removeStep(maze, possibility);

          if (JSON.stringify(possibility) === JSON.stringify(this.finish[0])) {
            console.log('found finish');
            infinity = false;
            console.log('steps', steps);
            console.log('maze', maze);
            return steps;
          }
        }
      }
        
    }
  }

  findShortestPath(steps) {
    let highest = Object.keys(steps).length - 1;
    console.log('steps', steps)
    console.log('highest', highest);
    let shortest = {};
    shortest[highest]=[...this.finish[0]];

    for (let i = highest-1; i > 0; i--) {
      let seeker = [...shortest[i+1]];
      let nextSteps = steps[i];
      for (let step of nextSteps) {
        if (this.areNeighbours(seeker, step)) {
          shortest[i]=[...step];
          break;
        } else {
          console.log('not neighbour');
        }
      
      }
    }
    shortest[0] = [...this.start[0]];
    console.log('shortest', shortest);
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
    console.log('possibilities inside FIND REAL', possibilities);
    let realPossibilities = [];
    for (let possibility of possibilities) {  
      //verifiy if possibility is in draw
      let verified = JSON.stringify(maze);
      let toCheck = JSON.stringify(possibility);
      if (verified.includes(toCheck)) {
        realPossibilities.push(possibility);
      }
    }
    console.log('real possibilities', realPossibilities);
    return realPossibilities;
  }

  
  findPossibilities(step, maze) {
    console.log(maze);
    //let possibilities = [];
    let possibilitiesAll = this.createNeighbours(step);
    console.log('possibilitiesAll', possibilitiesAll);
    return possibilitiesAll;
  }

  createNeighbours(step) {
    let crowd = [];
    for (let element of this.neighbours) {
      let neighbour = [...element];
      console.log('your neighbour', neighbour);
      console.log('neighbour step', step);
      neighbour[0] += step[0];
      neighbour[1] += step[1];
      crowd.push(neighbour);
    }
    console.log('crowd', crowd);
    return crowd;
  }


  removeStep(maze, step) {
    let indexToRemove = maze.findIndex(function (array) {
      console.log('comparing', array, step);
      return JSON.stringify(array) === JSON.stringify(step);
    });
    console.log('index to remove', indexToRemove);
    if (indexToRemove !== -1) {
      maze.splice(indexToRemove, 1);
    }
  }

  clearAll() {
    console.log('clearing all');
    this.cleaningPaths();
    this.dom.table.innerHTML = '';
    this.fillGrid(this.dom.table);
  }

  proceedClick(coordinates, element) {
    switch (this.phase[0][0]) {
    case 'DRAW ROUTES':
      console.log('draw');
      return this.oneDraw(coordinates,element);
    case 'PICK START':
      console.log('start');
      return this.pickStart(coordinates, element);
    case 'PICK FINISH':
      console.log('finish');
      return this.pickFinish(coordinates, element);
    case 'CALCULATE ROUTE':
      console.log('calculate');
      break;//return this.analyzePath();
    case 'THE BEST ROUTE IS...':
      console.log('start');
      break;
    default:
      console.log('Unknown action.');
    }
  }

  oneDraw(coordinates, element) {
    console.log('inside oneDraw', element);
    
    if (this.isValidDraw(coordinates)) {
      this.draw.push([...coordinates]);
      console.log('after push', this.draw);
      element.style.backgroundColor = 'red';
      return;
    }
    console.log('invalid');
    element.style.backgroundColor = 'grey';
  }

  pickStart(coordinates, element) {
    //Check if coordinates in draw array
    if (this.isValidStart(coordinates)) {
      this.clearStart();
      this.start.push([...coordinates]);

      element.style.backgroundColor = 'yellow';
      element.innerHTML = 'S';
      
    }
  }
  pickFinish(coordinates, element) {
    //Check if coordinates in draw array
    if (this.isValidFinish(coordinates)) {
      this.clearFinish();
      this.finish.push([...coordinates]);

      element.style.backgroundColor = 'blue';
      element.innerHTML = 'F';
    }
  }

  clearStart() {

    if (this.start.length == 0) {
      console.log('nothing to clear');
      return;
    }

    console.log('clearing', this,this.start.lenght);
    let toClear = this.start.pop().join(' ');
    let element = document.getElementById(toClear);
    element.style.backgroundColor = 'red';
    element.innerHTML = '';
  }

  clearFinish() {

    if (this.finish.length == 0) {
      console.log('nothing to clear');
      return;
    }

    console.log('clearing', this, this.start.lenght);
    let toClear = this.finish.pop().join(' ');
    let element = document.getElementById(toClear);
    element.style.backgroundColor = 'red';
    element.innerHTML = '';
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

  isValidDraw(coordinates) { 

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

  isValidStart(coordinates) {

    if (this.draw.length<2) {
      console.log('path too short');
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
      console.log('path too short');
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
      thisTable.proceedClick(toCheck, event.target);//thisTable.oneDraw(toCheck);
      //console.log('checked', checked);
      //if (checked) {
      //  event.target.style.backgroundColor = checked;
      //}

      //console.log('LISTENER ADDED');
    });
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