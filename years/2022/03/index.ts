import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 3;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/03/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/03/data.txt
// problem url  : https://adventofcode.com/2022/day/3

function priority(common: string) {
	let common_priority = common.charCodeAt(0);
	if (common_priority >= "a".charCodeAt(0)) {
		common_priority = common_priority - "a".charCodeAt(0) + 1;
	} else {
		common_priority = common_priority - "A".charCodeAt(0) + 27;
	}
	return common_priority;
}

async function p2022day3_part1(input: string, ...params: any[]) {
	const lines: string[] = input.split("\n");
	let total = 0;
	for (const [i, line] of lines.entries()) {
		const mid = line.length / 2;
		const a = new Set([...line.substring(0, mid)]);
		const b = new Set([...line.substring(mid)]);
		const c = util.intersection(a, b);
		const common = [...c.values()][0];
		total += priority(common);
	}
	return total;
}

async function p2022day3_part2(input: string, ...params: any[]) {
	const lines: string[] = input.split("\n");
	let total = 0;
	let i = 0;
	while (i < lines.length) {
		const a = new Set([...lines[i]]);
		const b = new Set([...lines[i + 1]]);
		const c = new Set([...lines[i + 2]]);
		let ab = util.intersection(a, b);
		let abc = util.intersection(ab, c);
		let common = [...abc.values()][0];
		total += priority(common);
		i += 3;
	}
	return total;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
			extraArgs: [],
			expected: `157`,
		},
	];

	const part2tests: TestCase[] = [
		{
			input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
			extraArgs: [],
			expected: `70`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2022, part1Solution, part2Solution);

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
