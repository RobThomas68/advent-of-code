import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 2;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/02/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/02/data.txt
// problem url  : https://adventofcode.com/2022/day/2

const shapeScore = new Map([
	["X", 1],
	["Y", 2],
	["Z", 3],
]);
const outcomeScore = new Map([
	["W", 6],
	["L", 0],
	["D", 3],
]);
const usToOutcome = new Map([
	["X", "L"],
	["Y", "D"],
	["Z", "W"],
]);
const ourPlay = new Map([
	[
		"X",
		new Map([
			["A", "Z"],
			["B", "X"],
			["C", "Y"],
		]),
	],
	[
		"Y",
		new Map([
			["A", "X"],
			["B", "Y"],
			["C", "Z"],
		]),
	],
	[
		"Z",
		new Map([
			["A", "Y"],
			["B", "Z"],
			["C", "X"],
		]),
	],
]);

async function p2022day2_part1(input: string, ...params: any[]) {
	const lines: string[] = input.split("\n");
	let totalScore = 0;
	for (const [i, line] of lines.entries()) {
		const [them, us] = line.split(" ");

		let outcome = "";
		switch (them) {
			case "A":
				outcome = us === "Y" ? "W" : us === "X" ? "D" : "L";
				break;
			case "B":
				outcome = us === "Z" ? "W" : us === "Y" ? "D" : "L";
				break;
			case "C":
				outcome = us === "X" ? "W" : us === "Z" ? "D" : "L";
				break;
		}
		totalScore += (outcomeScore.get(outcome) || 0) + (shapeScore.get(us) || 0);

		//log(i, line, them, us, totalScore);
	}

	return totalScore;
}

async function p2022day2_part2(input: string, ...params: any[]) {
	const lines: string[] = input.split("\n");
	let totalScore = 0;
	for (const [i, line] of lines.entries()) {
		const [them, us] = line.split(" ");
		const outcome = usToOutcome.get(us) || "";
		let a = ourPlay.get(us);
		let b = a?.get(them) || "";
		totalScore += (outcomeScore.get(outcome) || 0) + (shapeScore.get(b) || 0);
	}
	return totalScore;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `A Y
B X
C Z`,
			extraArgs: [],
			expected: `15`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `A Y
B X
C Z`,
			extraArgs: [],
			expected: `12`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2022, part1Solution, part2Solution);

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
