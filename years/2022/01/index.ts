import _, { add, max, sum } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { exit } from "process";

const YEAR = 2022;
const DAY = 1;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/01/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/01/data.txt
// problem url  : https://adventofcode.com/2022/day/1

function getSortedCalorieTotals(input: string): number[] {
	const lines: string[] = input.split("\n");
	let elfCalorieTotals: number[] = [];
	let elfCalories: number[] = [];
	for (const [i, line] of lines.entries()) {
		if (line.trim() !== "") {
			elfCalories.push(Number(line));
		}
		if (line.trim() === "" || i === lines.length - 1) {
			elfCalorieTotals.push(elfCalories.reduce((partialSum, a) => partialSum + a, 0));
			elfCalories = [];
		}
	}
	elfCalorieTotals.sort((a, b) => (a > b ? -1 : 1));
	return elfCalorieTotals;
}

async function p2022day1_part1(input: string, ...params: any[]) {
	return getSortedCalorieTotals(input)
		.slice(0, 1)
		.reduce((partialSum, a) => partialSum + a, 0);
}

async function p2022day1_part2(input: string, ...params: any[]) {
	return getSortedCalorieTotals(input)
		.slice(0, 3)
		.reduce((partialSum, a) => partialSum + a, 0);
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
			extraArgs: [],
			expected: `24000`,
		},
	];

	const part2tests: TestCase[] = [
		{
			input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
			extraArgs: [],
			expected: `45000`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day1_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day1_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day1_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day1_part2(input));
	const part2After = performance.now();

	logSolution(1, 2022, part1Solution, part2Solution);

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
