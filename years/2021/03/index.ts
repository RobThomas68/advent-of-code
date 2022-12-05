import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2021;
const DAY = 3;

// solution path: /home/rob/Workspaces/advent-of-code/years/2021/03/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2021/03/data.txt
// problem url  : https://adventofcode.com/2021/day/3

async function p2021day3_part1(input: string, ...params: any[]) {
	var counts: { [key: number]: number } = {};
	const lines = input.split("\n");
	for (const line of lines) {
		[...line].forEach((value, index) => (counts[index] = (counts[index] || 0) + Number(value)));
	}

	let gammaStr = "";
	let epsilonStr = "";
	for (const k in counts) {
		let g = counts[k] > lines.length / 2 ? "1" : "0";
		let e = g === "1" ? "0" : "1";
		gammaStr += g;
		epsilonStr += e;
	}
	const gamma = parseInt(gammaStr, 2);
	const epsilon = parseInt(epsilonStr, 2);

	return gamma * epsilon;
}

const part2 = (lines: string[], index: number): number => {
	const lt = (a: number, b: number) => {
		return a < b;
	};
	const gt = (a: number, b: number) => {
		return a > b;
	};

	let i = 0;
	while (lines.length > 1) {
		let splitLines = [];
		splitLines = [lines.filter(x => (x[i] === "0" ? x : "")), lines.filter(x => (x[i] === "1" ? x : ""))];

		// log({ i: i, len: lines.length, sl0: splitLines[0].toString(), sl1: splitLines[1].toString() });

		const op = index == 0 ? lt : gt;
		if (splitLines[0].length == splitLines[1].length) {
			lines = splitLines[index];
		} else if (op(splitLines[0].length, splitLines[1].length)) {
			lines = splitLines[0];
		} else {
			lines = splitLines[1];
		}
		i += 1;
	}
	const codeStr = lines[0].trim();
	const code = parseInt(codeStr, 2);
	// log({ index, codeStr, code });
	return code;
};

async function p2021day3_part2(input: string, ...params: any[]) {
	let lines = input.split("\n");
	// log(lines);
	const co2 = part2(lines, 0);
	const oxygen = part2(lines, 1);
	return co2 * oxygen;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`,
			extraArgs: [],
			expected: `198`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`,
			extraArgs: [],
			expected: `230`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2021, part1Solution, part2Solution);

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
