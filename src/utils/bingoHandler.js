

const checkBingoWin = (grid, checkedNumbers) => {
  const gridSize = grid.length;
  let matchedPatternCount = 0;

  for (let row = 0; row < gridSize; row++) {
    if (grid[row].every((number) => checkedNumbers?.includes(number))) {
      console.log(`Bingo in Row ${row + 1}`);
      matchedPatternCount++;
    }
  }

  for (let col = 0; col < gridSize; col++) {
    let columnMatch = true;
    for (let row = 0; row < gridSize; row++) {
      if (!checkedNumbers.includes(grid[row][col])) {
        columnMatch = false;
        break;
      }
    }
    if (columnMatch) {
      console.log(`Bingo in Column ${col + 1}`);
      matchedPatternCount++;
    }
  }

  let topLeftToBottomRight = true;
  for (let i = 0; i < gridSize; i++) {
    if (!checkedNumbers.includes(grid[i][i])) {
      topLeftToBottomRight = false;
      break;
    }
  }
  if (topLeftToBottomRight) {
    console.log("Bingo in Top-Left to Bottom-Right Diagonal");
    matchedPatternCount++;
  }

  let topRightToBottomLeft = true;
  for (let i = 0; i < gridSize; i++) {
    if (!checkedNumbers.includes(grid[i][gridSize - i - 1])) {
      topRightToBottomLeft = false;
      break;
    }
  }
  if (topRightToBottomLeft) {
    console.log("Bingo in Top-Right to Bottom-Left Diagonal");
    matchedPatternCount++;
  }

  // Check if we have 5 matched patterns
  if (matchedPatternCount >= 5) {
    console.log(`Total Matched Patterns: ${matchedPatternCount}`);
    return true;
  }

  return false; 
};

export  default checkBingoWin;

