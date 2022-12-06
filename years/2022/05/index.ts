import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { exit } from "process";

const YEAR = 2022;
const DAY = 5;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/05/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/05/data.txt
// problem url  : https://adventofcode.com/2022/day/5

function getStackBounds(lines: string[]) {
	let stackBottomIndex = 0;
	for (const [i, line] of lines.entries()) {
		if (line[1] == "1") {
			stackBottomIndex = i;
			break;
		}
	}
	return [stackBottomIndex, (lines[stackBottomIndex].length + 1) / 4];
}

function getStacks(stacks: Map<number, Array<string>>, lines: string[], stackBottomIndex: number, stackCount: number) {
	for (let row = stackBottomIndex - 1; row >= 0; row--) {
		let i = 1;

		for (let stack = 1; stack <= stackCount; stack++) {
			const crate = lines[row][i];
			if (crate.trim()) {
				push(stacks, stack, crate);
				//console.log({ row, i, stack, crate });
			}
			i += 4;
		}
	}
}
function move(stacks: Map<number, Array<string>>, count: number, from: number, to: number) {
	for (let i = 0; i < count; i++) {
		const crate = stacks.get(from)?.pop() || "";
		stacks.get(to)?.push(crate);
	}
}

function move2(stacks: Map<number, Array<string>>, count: number, from: number, to: number) {
	let temp = new Array<string>();
	for (let i = 0; i < count; i++) {
		const crate = stacks.get(from)?.pop() || "";
		temp.push(crate);
	}

	for (let c of temp.reverse()) {
		stacks.get(to)?.push(c);
	}
}

function push(stacks: Map<number, Array<string>>, stack: number, crate: string) {
	let s = stacks.get(stack) || new Array();
	s.push(crate);
	stacks.set(stack, s);
}

function getResult(stacks: Map<number, Array<string>>, stackCount: number) {
	let result = "";
	for (let stack = 1; stack <= stackCount; stack++) {
		result += stacks.get(stack)?.at(-1);
	}
	return result;
}

function logStacks(stacks: Map<number, Array<string>>, stackCount: number) {
	for (let stack = 1; stack <= stackCount; stack++) {
		console.log(stacks.get(stack));
	}
}

async function p2022day5_part1(input: string, ...params: any[]) {
	const lines: string[] = input.split("\n");
	const [stackBottomIndex, stackCount] = getStackBounds(lines);
	let stacks = new Map<number, Array<string>>();
	getStacks(stacks, lines, stackBottomIndex, stackCount);

	for (let row = stackBottomIndex; row < lines.length; row++) {
		const [_c, count, _f, from, _t, to] = lines[row].split(" ");
		move(stacks, Number(count), Number(from), Number(to));
	}

	return getResult(stacks, stackCount);
}

async function p2022day5_part2(input: string, ...params: any[]) {
	const lines: string[] = input.split("\n");
	const [stackBottomIndex, stackCount] = getStackBounds(lines);
	let stacks = new Map<number, Array<string>>();
	getStacks(stacks, lines, stackBottomIndex, stackCount);

	for (let row = stackBottomIndex; row < lines.length; row++) {
		const [_c, count, _f, from, _t, to] = lines[row].split(" ");
		move2(stacks, Number(count), Number(from), Number(to));
	}

	return getResult(stacks, stackCount);
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
			extraArgs: [],
			expected: `CMZ`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
			extraArgs: [],
			expected: `MCD`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	exit;
	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2022, part1Solution, part2Solution);

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
