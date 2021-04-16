import React, { useRef, useState } from 'react';
import './App.css';

const numRows = 70;
const numCols = 32;

const neighborRelativePositions = [
	[0, 1],
	[0, -1],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
	[1, 0],
	[-1, 0],
];

const App: React.FC = () => {
	const [grid, setGrid] = useState(createGrid());
	const [prevGrid, setPrevGrid] = useState(createGrid());
	const [isRunning, setRunning] = useState(false);
	const [isNeighborsVisible, setNeighborVisible] = useState(false);
	const [isGridVisible, setGridVisible] = useState(true);
	const [speed, setSpeed] = useState(500);

	function createGrid() {
		let newArr = [];
		for (let i = 0; i < numRows; i++) {
			let row = [];
			for (let j = 0; j < numCols; j++) {
				row.push(false);
			}
			newArr.push(row);
		}
		return newArr;
	}

	function duplicate2DArray(array: boolean[][]) {
		let newArr: boolean[][] = [];
		array.forEach((val) => {
			newArr.push([...val]);
		});

		return newArr;
	}

	function setNode(x: number, y: number, isActive: boolean) {
		let newGrid = [...grid];
		newGrid[x][y] = isActive;
		setGrid(newGrid);
	}

	function saveGrid() {
		setPrevGrid(duplicate2DArray(grid));
	}

	function loadGrid() {
		setRunning(false);
		runRef.current = false;
		let curGrid = duplicate2DArray(grid);
		setGrid(duplicate2DArray(prevGrid));
		setPrevGrid(curGrid);
	}

	function drawGrid() {
		let divGrid = grid.map((row, x) => {
			let colDivs = row.map((node, y) => {
				let neighbors = '';
				if (isNeighborsVisible) {
					let neighborsVal = getNeighbors(grid, x, y);
					neighbors = neighborsVal === 0 ? '' : `${neighborsVal}`;
				}
				return (
					<div
						style={{
							width: '20px',
							height: '20px',
							boxSizing: 'border-box',
							backgroundColor: `${node ? 'gray' : '#1e1e1e'}`,
							border: `${isGridVisible ? 'solid 0.1px #5f5f5f' : 'none'}`,
							textAlign: 'center',
							color: 'white',
						}}
						onClick={() => {
							setNode(x, y, !node);
						}}>
						{neighbors}
					</div>
				);
			});
			return (
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{colDivs}
				</div>
			);
		});

		return divGrid;
	}
	let runRef = useRef(isRunning);
	let speedRef = useRef(speed);

	function getNeighbors(grid: any, x: number, y: number) {
		let neighbors = 0;
		neighborRelativePositions.forEach(([xOffset, yOffset]) => {
			let xPos = x + xOffset;
			let yPos = y + yOffset;
			if (xPos >= 0 && xPos < numRows && yPos >= 0 && yPos < numCols) {
				if (grid[xPos][yPos]) neighbors++;
			}
		});
		return neighbors;
	}

	function simulate(canRun?: boolean) {
		if (canRun) {
			setGrid((prevState) => {
				let newGrid = duplicate2DArray(prevState);
				prevState.forEach((row, x) => {
					row.forEach((node, y) => {
						let neighbors = getNeighbors(prevState, x, y);

						// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
						// Any live cell with more than three live neighbours dies, as if by overpopulation.
						if (neighbors < 2 || neighbors > 3) newGrid[x][y] = false;
						// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
						if (!node && neighbors === 3) newGrid[x][y] = true;
					});
				});
				return newGrid;
			});

			setTimeout(() => {
				simulate(runRef.current);
			}, speedRef.current);
		}
	}

	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}>
			<div>
				<div className='menu'>
					<button
						style={{
							marginBottom: '1em',
							width: '5em',
							border: 'none',
							padding: '.7em',
						}}
						onClick={() => {
							if (!isRunning) {
								saveGrid();
								setRunning(true);
								runRef.current = true;
								simulate(true);
							} else {
								setRunning(false);
								runRef.current = false;
							}
						}}>
						{isRunning ? 'Stop' : 'Run'}
					</button>
					<button
						style={{
							marginBottom: '1em',
							marginLeft: '2em',
							width: '5em',
							border: 'none',
							padding: '.7em',
						}}
						onClick={() => {
							setRunning(false);
							runRef.current = false;
							saveGrid();
							setGrid(createGrid());
						}}>
						Clear
					</button>
					<button
						style={{
							marginBottom: '1em',
							marginLeft: '2em',
							width: '7em',
							border: 'none',
							padding: '.7em',
						}}
						onClick={() => {
							setGridVisible(!isGridVisible);
						}}>
						{isGridVisible ? 'Hide Grid' : 'Show Grid'}
					</button>
					<button
						style={{
							marginBottom: '1em',
							marginLeft: '2em',
							width: '15em',
							border: 'none',
							padding: '.7em',
						}}
						onClick={() => {
							setNeighborVisible(!isNeighborsVisible);
						}}>
						{isNeighborsVisible
							? 'Hide Number Of Neighbors'
							: 'Show Number Of Neighbors'}
					</button>
					<button
						style={{
							marginBottom: '1em',
							marginLeft: '2em',
							width: '5em',
							border: 'none',
							padding: '.7em',
						}}
						onClick={() => {
							window.location = 'https://wikipedia.org/wiki/Conway%27s_Game_of_Life' as any;
						}}>
						About
					</button>
					<div>
						<p>Speed ({speed}): </p>
						<input
							className='slider'
							type='range'
							min='0'
							max='1000'
							value={speed}
							onChange={(e) => {
								setSpeed(parseInt(e.target.value));
								speedRef.current = parseInt(e.target.value);
							}}></input>
					</div>
					<button
						style={{
							marginBottom: '1em',
							marginLeft: '2em',
							width: '5em',
							border: 'none',
							padding: '.7em',
						}}
						onClick={() => {
							loadGrid();
						}}>
						Restore
					</button>
				</div>
				<div
					className='App'
					style={{
						display: 'flex',
						flexDirection: 'row',
						border: 'solid 2px #5f5f5f',
					}}>
					{drawGrid()}
				</div>
			</div>
		</div>
	);
};

export default App;
