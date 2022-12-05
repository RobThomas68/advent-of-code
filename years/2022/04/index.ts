import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 4;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/04/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/04/data.txt
// problem url  : https://adventofcode.com/2022/day/4

async function p2022day4_part1(input: string, ...params: any[]) {
	const lines: string[] = input.split("\n");
	let count = 0;
	for (const [i, line] of lines.entries()) {
		// const [a, b] = line.split(",");
		// const [a1, a2] = a.split("-").map(x => Number(x));
		// const [b1, b2] = b.split("-").map(x => Number(x));
		const [a1, a2, b1, b2] = line
			.split(",")
			.map(x => x.split("-"))
			.flat()
			.map(x => Number(x));
		const aa = new Set(util.range(a1, a2 + 1));
		const bb = new Set(util.range(b1, b2 + 1));

		const intersection = util.intersection(aa, bb);
		if (intersection.size === aa.size || intersection.size === bb.size) {
			count += 1;
		}
	}
	return count;
}

async function p2022day4_part2(input: string, ...params: any[]) {
	const lines: string[] = input.split("\n");
	let count = 0;
	for (const [i, line] of lines.entries()) {
		// const [a, b] = line.split(",");
		// const [a1, a2] = a.split("-").map(x => Number(x));
		// const [b1, b2] = b.split("-").map(x => Number(x));

		const [a1, a2, b1, b2] = line
			.split(",")
			.map(x => x.split("-"))
			.flat()
			.map(x => Number(x));

		const aa = new Set(util.range(a1, a2 + 1));
		const bb = new Set(util.range(b1, b2 + 1));

		const intersection = util.intersection(aa, bb);
		if (intersection.size > 0) {
			count += 1;
		}
	}
	return count;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
			extraArgs: [],
			expected: `2`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
			extraArgs: [],
			expected: `4`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2022, part1Solution, part2Solution);

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
