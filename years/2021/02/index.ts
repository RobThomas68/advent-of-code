import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { TupleType } from "typescript";

const YEAR = 2021;
const DAY = 2;

// solution path: /home/rob/Workspaces/advent-of-code/years/2021/02/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2021/02/data.txt
// problem url  : https://adventofcode.com/2021/day/2

class Submarine {
	depth: number = 0;
	horizontal_position: number = 0;
	aim: number = 0;
	cmdMove(distance: number) {
		this.horizontal_position += distance;
	}
	cmdDive(depth: number) {
		this.depth += depth;
	}
	cmdAim(value: number) {
		this.aim += value;
	}
}

type CommandType = [action: string, value: number];

function getCommands(input: string): Array<CommandType> {
	let commands = new Array<CommandType>();
	for (const line of input.split("\n")) {
		const [action, value] = line.split(" ");
		commands.push([action, Number(value)]);
	}
	return commands;
}

async function p2021day2_part1(input: string, ...params: any[]) {
	let submarine: Submarine = new Submarine();
	for (const [action, value] of getCommands(input)) {
		switch (action) {
			case "forward":
				submarine.cmdMove(value);
				break;
			case "up":
				submarine.cmdDive(-value);
				break;
			case "down":
				submarine.cmdDive(value);
				break;
		}
	}
	return submarine.depth * submarine.horizontal_position;
}

async function p2021day2_part2(input: string, ...params: any[]) {
	let submarine: Submarine = new Submarine();
	for (const [action, value] of getCommands(input)) {
		switch (action) {
			case "forward":
				submarine.cmdMove(value);
				submarine.cmdDive(submarine.aim * value);
				break;
			case "up":
				submarine.cmdAim(-value);
				break;
			case "down":
				submarine.cmdAim(value);
				break;
		}
	}
	return submarine.depth * submarine.horizontal_position;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `forward 5
down 5
forward 8
up 3
down 8
forward 2`,
			extraArgs: [],
			expected: `150`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `forward 5
down 5
forward 8
up 3
down 8
forward 2`,
			extraArgs: [],
			expected: `900`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2021, part1Solution, part2Solution);

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
