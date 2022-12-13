import _, { range, tail } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { Grid, Cell, GridPos, Dir } from "../../../util/grid";

const YEAR = 2022;
const DAY = 9;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/09/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/09/data.txt
// problem url  : https://adventofcode.com/2022/day/9

const dirMap = new Map([
	["R", Dir.E],
	["L", Dir.W],
	["U", Dir.N],
	["D", Dir.S],
	["N", Dir.N],
	["S", Dir.S],
	["W", Dir.W],
	["E", Dir.E],
	["NE", Dir.NE],
	["SE", Dir.SE],
	["NW", Dir.NW],
	["SW", Dir.SW],
]);

async function p2022day9_part1(input: string, ...params: any[]) {
	function moveHeadCell(grid: Grid, cell: Cell, direction: string): Cell {
		const pos = dirMap.get(direction);
		if (pos) {
			const c = grid.getCell(cell.position)?.repeatMovements([pos!], 1);
			if (c) {
				cell.setValue(".");
				c!.setValue("H");
				cell = c;
			}
		}
		return cell;
	}

	function moveTailCell(grid: Grid, head: Cell, tail: Cell): Cell {
		const neighbors = hCell.neighbors(true);
		if (
			head.position.toString() === tail.position.toString() ||
			neighbors.some(x => x.position.toString() === tCell.position.toString())
		) {
			// console.log(head, tail);
		} else {
			tail.setValue(".");
			let dir = "";
			if (head.position[0] < tail.position[0]) {
				dir = "N";
			} else if (head.position[0] > tail.position[0]) {
				dir = "S";
			}
			if (head.position[1] > tail.position[1]) {
				dir += "E";
			} else if (head.position[1] < tail.position[1]) {
				dir += "W";
			}
			tail = tail.repeatMovements([dirMap.get(dir)!])!;
			tail.setValue("T");
		}
		return tail;
	}

	const grid = new Grid({ fillWith: ".", rowCount: 20000, colCount: 20000 });
	let tailPositions = new Set<string>();
	let hPos: GridPos = [grid.rowCount / 2, grid.colCount / 2];
	let tPos: GridPos = [grid.rowCount / 2, grid.colCount / 2];
	let hCell = grid.getCell(hPos)!;
	let tCell = grid.getCell(tPos)!;

	const lines: string[] = input.split("\n");
	for (const [i, line] of lines.entries()) {
		const [direction, count] = line.split(" ");

		for (let i of range(Number(count))) {
			hCell = moveHeadCell(grid, hCell, direction);
			if (hCell.position.toString() !== tCell.position.toString()) {
				tCell.setValue("T");
			}

			// console.log(grid.toString());
			// console.log("----------------------");
			tCell = moveTailCell(grid, hCell, tCell);
			// console.log(grid.toString());
			// console.log("----------------------");

			tailPositions.add(tCell.position.toString());
		}
	}
	return tailPositions.size;
}

async function p2022day9_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
			extraArgs: [],
			expected: `13`,
		},
	];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day9_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day9_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day9_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day9_part2(input));
	const part2After = performance.now();

	logSolution(9, 2022, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
