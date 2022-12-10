import _, { max } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import * as grid from "../../../util/grid";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { createUnparsedSourceFile } from "typescript";

const YEAR = 2022;
const DAY = 8;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/08/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/08/data.txt
// problem url  : https://adventofcode.com/2022/day/8

function findCells(c: grid.Cell, direction: string) {
	const myCell = c;
	function pred(gridCell: grid.Cell) {
		switch (direction) {
			case "left":
				return myCell.position[0] === gridCell.position[0] && gridCell.position[1] < myCell.position[1];
			case "right":
				return myCell.position[0] === gridCell.position[0] && gridCell.position[1] > myCell.position[1];
			case "up":
				return myCell.position[0] > gridCell.position[0] && gridCell.position[1] === myCell.position[1];
			case "down":
				return myCell.position[0] < gridCell.position[0] && gridCell.position[1] === myCell.position[1];
			default:
				return false;
		}
	}
	return pred;
}

async function p2022day8_part1(input: string, ...params: any[]) {
	const g = new grid.Grid({ serialized: input });
	// g.log();

	let visibleCount = g.colCount * 2 + (g.rowCount - 2) * 2;
	for (const cell of g) {
		if (!cell.isEdge()) {
			for (const d of ["left", "right", "up", "down"]) {
				const cells = g.getCells(findCells(cell, d));
				const shorter = cells.filter(c => c.value < cell.value);
				// log({ c: cell.value, d, cells, shorter });
				if (cells.length == 0 || cells.length === shorter.length) {
					visibleCount += 1;
					break;
				}
			}
		}
	}
	return visibleCount;
}

async function p2022day8_part2(input: string, ...params: any[]) {
	const g = new grid.Grid({ serialized: input });
	let maxScore = 0;

	const directions = [
		grid.Cell.prototype.north,
		grid.Cell.prototype.south,
		grid.Cell.prototype.east,
		grid.Cell.prototype.west,
	];

	for (const cell of g) {
		if (!cell.isEdge()) {
			let cellScore = 1;
			for (const f of directions) {
				let directionScore = 0;
				let c = f.call(cell);
				while (c) {
					directionScore += 1;
					if (cell.value <= c.value) {
						break;
					}
					c = f.call(c);
				}
				cellScore *= directionScore;
			}
			if (cellScore > maxScore) {
				maxScore = cellScore;
			}
		}
	}
	return maxScore;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `30373
25512
65332
33549
35390`,
			extraArgs: [],
			expected: `21`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `30373
25512
65332
33549
35390`,
			extraArgs: [],
			expected: `8`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day8_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day8_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day8_part2(input));
	const part2After = performance.now();

	logSolution(8, 2022, part1Solution, part2Solution);

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
