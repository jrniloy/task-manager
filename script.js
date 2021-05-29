const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveBtns = document.querySelectorAll(".save-btn");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done", "Feels Awesome"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  /*
  localStorage.setItem("backlogItems", JSON.stringify(backlogListArray));
  localStorage.setItem("progressItems", JSON.stringify(progressListArray));
  localStorage.setItem("completeItems", JSON.stringify(completeListArray));
  localStorage.setItem("onHoldItems", JSON.stringify(onHoldListArray));
  */

  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((name, index) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]));
  });
}

// Filter arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

/// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const markup = `
  <li class="drag-item" draggable="true" ondragstart="drag(event)" contenteditable="true" id="${index}" onfocusout="updateItem(${index}, ${column})">${item}</li>
  `;

  // Append
  columnEl.insertAdjacentHTML("beforeend", markup);
}

/// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  !updatedOnLoad && getSavedColumns();

  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });

  // filter array
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });

  // filter array
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });

  // filter array
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });

  // filter array
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - delete if necessary, or update array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;

  if (!dragging) {
    !selectedColumnEl[id].textContent
      ? delete selectedArray[id]
      : (selectedArray[id] = selectedColumnEl[id].textContent);

    updateDOM();
  }
}

/// Add text to column list and reset textbox
function addTextToColumn(column) {
  const itemText = addItems[column].textContent;
  selectedArray = listArrays[column];
  itemText && selectedArray.push(itemText);
  addItems[column].textContent = "";

  updateDOM();
}

// SHow Input box onclick
function showInputBox(column) {
  addBtns[column].style.display = "none";
  saveItemBtns[column].style.display = "flex";
  saveItemBtns[column].style.justiySelf = "flex-end";
  addItemContainers[column].style.display = "flex";

  addItems[column].focus();
}

// Hide input box on save
function hideInputBox(column) {
  addBtns[column].style.display = "flex";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";

  addTextToColumn(column);
}

//  Allows arrays to reflect drag and drop items
function rebuildArrays() {
  backlogListArray = [];
  for (i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }

  progressListArray = [];
  for (i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }

  completeListArray = [];
  for (i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }

  onHoldListArray = [];
  for (i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  //  Update DOM to rebuild DOM
  updateDOM();
}

// WHen Items start dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column allows item to drop
function allowDrop(e) {
  e.preventDefault();
}

// When item enters the column area
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// Dropping item in column
function drop(e) {
  e.preventDefault();

  // Remove background color/padding
  listColumns.forEach((column) => column.classList.remove("over"));

  //  Add item to column
  const parentEl = listColumns[currentColumn];
  parentEl.appendChild(draggedItem);

  // Dragging complete
  dragging = false;

  rebuildArrays();
}

// Event listner
addItemContainers.forEach((conatiner, i) => {
  conatiner.addEventListener("focusout", () => {
    addBtns[i].style.display = "flex";
    saveItemBtns[i].style.display = "none";
    addItemContainers[i].style.display = "none";
  });
});

// on load
updateDOM();
