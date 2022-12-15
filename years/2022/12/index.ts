import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import { Cell, Grid } from "../../../util/grid";
import * as graph from "../../../util/graph";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { start } from "repl";

const YEAR = 2022;
const DAY = 12;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/12/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/12/data.txt
// problem url  : https://adventofcode.com/2022/day/12

class HeightMap {
	private grid: Grid;
	private nodeChildrenMap: Map<string, Array<string>>;
	private startCells: Cell[];
	private endCell: Cell | undefined;

	static getCellHeight(cell: Cell) {
		let cv = cell.value;
		if (cv === "S") {
			cv = "a";
		} else if (cv === "E") {
			cv = "z";
		}
		return cv.charCodeAt(0);
	}

	constructor(input: string, isPart2: boolean) {
		this.grid = new Grid({ serialized: input });
		this.nodeChildrenMap = new Map<string, Array<string>>();
		this.startCells = [];
		this.endCell = undefined;

		for (const cell of this.grid) {
			if (cell.value === "S" || (isPart2 && cell.value === "a")) {
				this.startCells.push(cell);
			}
			if (cell.value === "E") {
				this.endCell = cell;
			}

			const a = HeightMap.getCellHeight(cell);
			const key = cell.toString();
			for (const c of cell.neighbors()) {
				const b = HeightMap.getCellHeight(c);
				if (b - a <= 1) {
					this.addChild(key, c.toString());
				}
			}
		}
	}

	isEnd(key: string) {
		return this.endCell ? key === this.endCell.toString() : false;
	}

	getNeighbors(key: string) {
		const children = this.nodeChildrenMap.get(key);
		return children ? children : [];
		// if (children) {
		// 	return children;
		// } else {
		// 	return [];
		// }
	}

	addChild(key: string, child: string) {
		const children = this.nodeChildrenMap.get(key) || new Array<string>();
		children.push(child);
		this.nodeChildrenMap.set(key, children);
	}

	solve() {
		let results: number[] = [];
		for (const startCell of this.startCells) {
			const start = startCell ? startCell.toString() : "";
			const result = graph.bfSearch({
				isEnd: node => this.isEnd(node),
				start: start,
				neighbors: node => this.getNeighbors(node),
				allPaths: true,
			});
			if (result) {
				results.push(result.shortestPath.length - 1);
			}
		}
		return _.min(results);
	}
}

async function p2022day12_part1(input: string, ...params: any[]) {
	const map = new HeightMap(input, false);
	return map.solve();
}

async function p2022day12_part2(input: string, ...params: any[]) {
	const map = new HeightMap(input, true);
	return map.solve();
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
			extraArgs: [],
			expected: `31`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
			extraArgs: [],
			expected: `29`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day12_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day12_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day12_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day12_part2(input));
	const part2After = performance.now();

	logSolution(12, 2022, part1Solution, part2Solution);

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
