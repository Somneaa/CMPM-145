/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  let grid = [];

  // Fill background
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  const numRooms = 10;
  const rooms = [];

  // Place multiple rooms
  for (let r = 0; r < numRooms; r++) {
    const roomWidth = floor(random(4, 8));
    const roomHeight = floor(random(4, 8));
    const roomX = floor(random(1, numCols - roomWidth - 1));
    const roomY = floor(random(1, numRows - roomHeight - 1));

    // Store room center
    const centerX = roomX + floor(roomWidth / 2);
    const centerY = roomY + floor(roomHeight / 2);
    rooms.push({ x: centerX, y: centerY });

    for (let i = roomY; i < roomY + roomHeight; i++) {
      for (let j = roomX; j < roomX + roomWidth; j++) {
        grid[i][j] = ".";

        // Randomly generates chests with 3% chance
        if (random() < 0.03) {
          grid[i][j] = "*";
        }
        
        //Randomly generates silver chests with a 1% chance
        if (random() < 0.01) {
          grid[i][j] = "=";
        }
        
        //Randomly generates gold chests with a 0.5% chance
        if (random() < 0.005) {
          grid[i][j] = "/";
        }
      }
    }
  }

  //  Create hallways
  for (let i = 1; i < rooms.length; i++) {
    const prev = rooms[i - 1];
    const curr = rooms[i];

    if (random() < 0.5) {
      generateHorizontalHallway(grid, prev.x, curr.x, prev.y);
      generateVerticalHallway(grid, prev.y, curr.y, curr.x);
    } else {
      generateVerticalHallway(grid, prev.y, curr.y, prev.x);
      generateHorizontalHallway(grid, prev.x, curr.x, curr.y);
    }
  }

  return grid;
}

function generateHorizontalHallway(grid, x1, x2, y) {
  for (let x = min(x1, x2); x <= max(x1, x2); x++) {
    grid[y][x] = ".";
  }
}

function generateVerticalHallway(grid, y1, y2, x) {
  for (let y = min(y1, y2); y <= max(y1, y2); y++) {
    grid[y][x] = ".";
  }
}



function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == '_') {
        placeTile(i, j, 1, 31);
      } else if (grid[i][j] == '.') {
        placeTile(i, j, floor(random(21, 25)), 21); 
      } else if (grid[i][j] === "*") {
        placeTile(i, j, 0, 28); 
      } else if (grid[i][j] === "=") {
        placeTile(i, j, 1, 28); 
      } else if (grid[i][j] === "/") {
        placeTile(i, j, 2, 28); 
      }
    }
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


