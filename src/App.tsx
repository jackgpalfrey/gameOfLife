import React, { useState } from 'react';
import './App.css';

const numRows = 60;
const numCols = 30;

const App: React.FC = () => {
	const [grid, setGrid] = useState(createGrid());

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

	function setNode(x: number, y: number, isActive: boolean) {
		let newGrid = [...grid];
		newGrid[x][y] = isActive;
		setGrid(newGrid);
	}

	function drawGrid() {
		let divGrid = grid.map((row, x) => {
			let colDivs = row.map((node, y) => {
				return (
					<div
						style={{
							width: '20px',
							height: '20px',
							backgroundColor: `${node ? 'red' : null}`,
							border: 'solid 1px black',
						}}
						onClick={() => {
							setNode(x, y, !node);
						}}
					/>
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

	console.log(grid);
	return (
		<div
			className='App'
			style={{
				display: 'flex',
				flexDirection: 'row',
			}}>
			{drawGrid()}
		</div>
	);
};

export default App;
