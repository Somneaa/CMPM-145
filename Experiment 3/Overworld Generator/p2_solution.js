/* exported generateGrid, drawGrid */
/* global placeTile */

let treePositions = []; // Global list of tree locations

function generateGrid(numCols, numRows) {
  treePositions = [];
  let grid = [];
  // Fill background
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] === "_" && noise(i / 10, j / 10) > 0.5) {
        treePositions.push({ i, j });      
      }
    }
  }
  return grid;
}


function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == '_') {
        placeTile(i, j, (floor(random(4))), 0);
      } else if (grid[i][j] == '.') {
        placeTile(i, j, 0, 13); 
      } else if (grid[i][j] === "*") {
        placeTile(i, j, 0, 28); 
      } else if (grid[i][j] === "=") {
        placeTile(i, j, 1, 28); 
      } else if (grid[i][j] === "/") {
        placeTile(i, j, 2, 28); 
      }
    }
  }
  for (const pos of treePositions) {
    placeTile(pos.i, pos.j, 15, 0); // Adjust tile index to your tree graphic
  }
}

function gridCheck(grid, i, j, target) {
  // Check if i, j are inside the bounds
  if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) {
    return false;
  }
  return grid[i][j] === target;
}

function gridCode(grid, i, j, target) {
  const north = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  const south = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  const east = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  const west = gridCheck(grid, i, j - 1, target) ? 1 : 0;
  return (north << 0) + (south << 1) + (east << 2) + (west << 3);
}

function drawContext(grid, i, j, target, dti, dtj) {
  const code = gridCode(grid, i, j, target);
  const offsets = lookup[code];
  if (offsets) {
    const [tiOffset, tjOffset] = offsets;
    placeTile(i, j, dti + tiOffset, dtj + tjOffset);
  } else {
    placeTile(i, j, dti, dtj);
  }
}


const lookup = [
  [1, 1],
  [0, 0], 
  [1, 0], 
  [0, 1], 
  [2, 0], 
  [2, 1], 
  [2, 2], 
  [2, 3], 
  [3, 0], 
  [3, 1], 
  [3, 2], 
  [3, 3], 
  [4, 0], 
  [4, 1], 
  [4, 2], 
  [4, 3]  
];


