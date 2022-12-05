import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { convertCompilerOptionsFromJson } from "typescript";

const YEAR = 2021;
const DAY = 1;

// solution path: /home/rob/Workspaces/advent-of-code/years/2021/01/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2021/01/data.txt
// problem url  : https://adventofcode.com/2021/day/1

async function p2021day1_part1(input: string, ...params: any[]) {
	let previous = Number.MAX_SAFE_INTEGER;
	let count = 0;
	const lines: number[] = input.split("\n").map(i => Number(i));
	for (const line of lines) {
		if (line > previous) {
			count += 1;
		}
		previous = line;
	}
	return count;
}

let sum = (a: number, b: number) => {
	return a + b;
};

async function p2021day1_part2(input: string, ...params: any[]) {
	let count = 0;
	const lines: number[] = input.split("\n").map(i => Number(i));
	for (let i = 0; i < lines.length - 3; i++) {
		let sum1 = lines.slice(i + 1, i + 4).reduce(sum, 0);
		let sum2 = lines.slice(i, i + 3).reduce(sum, 0);
		if (sum1 > sum2) {
			count += 1;
		}
	}
	return count;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `199
200
208
210
200
207
240
269
260
263`,
			extraArgs: [],
			expected: `7`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `199
200
208
210
200
207
240
269
260
263`,
			extraArgs: [],
			expected: `5`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day1_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day1_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day1_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day1_part2(input));
	const part2After = performance.now();

	logSolution(1, 2021, part1Solution, part2Solution);

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
