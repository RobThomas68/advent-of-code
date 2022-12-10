import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 6;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/06/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/06/data.txt
// problem url  : https://adventofcode.com/2022/day/6

function distinctSequenceMarker(input: string, distinctCount: number) {
	for (let i = distinctCount - 1; i < input.length; i++) {
		const s = new Set(input.substring(i - (distinctCount - 1), i + 1));
		//console.log(s);
		if (s.size == distinctCount) {
			return i + 1;
		}
	}
}

async function p2022day6_part1(input: string, ...params: any[]) {
	return distinctSequenceMarker(input, 4);
}

async function p2022day6_part2(input: string, ...params: any[]) {
	return distinctSequenceMarker(input, 14);
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`, // 7
			//input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,      // 5
			//input: `nppdvjthqldpwncqszvftbrmjlhg`,      // 6
			//input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`, // 10
			//input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,  // 11
			extraArgs: [],
			expected: `7`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`, // 19
			//input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,      // 23
			//input: `nppdvjthqldpwncqszvftbrmjlhg`,      // 23
			//input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`, // 29
			//input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,  // 26
			extraArgs: [],
			expected: `19`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day6_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day6_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day6_part2(input));
	const part2After = performance.now();

	logSolution(6, 2022, part1Solution, part2Solution);

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
