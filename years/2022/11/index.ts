import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { moveMessagePortToContext } from "worker_threads";

const YEAR = 2022;
const DAY = 11;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/11/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/11/data.txt
// problem url  : https://adventofcode.com/2022/day/11

class Monkey {
	id: number;
	items: number[];
	operation: string[];
	test: number;
	ifTrue: string;
	ifFalse: string;
	count: number;

	constructor(id: number, items: number[], operation: string[], test: number, ifTrue: string, ifFalse: string) {
		this.id = id;
		this.items = items;
		this.operation = operation;
		this.test = test;
		this.ifTrue = ifTrue;
		this.ifFalse = ifFalse;
		this.count = 0;
	}

	takeTurn(monkeys: Monkeys, isPart1: boolean, M: number = 0) {
		for (const item of this.items) {
			let equation = this.operation.join(" ").replaceAll("old", item.toString());
			let worryLevel = Number(eval(equation));
			if (isPart1) {
				worryLevel = Math.floor(worryLevel / 3);
			} else {
				worryLevel = worryLevel % M;
			}
			// console.log({ worryLevel });
			let m = worryLevel % this.test === 0 ? this.ifTrue : this.ifFalse;
			monkeys[m].items.push(worryLevel);
		}
		this.count += this.items.length;
		this.items = [];
	}

	toString() {
		return `Monkey ${this.id}: ${this.count}`;
		// return `Monkey ${this.id}: ${this.count} ${this.items}`;
	}
}

interface Monkeys {
	[index: string]: Monkey;
}

function parseInput(input: string) {
	const monkeys: Monkeys = {};
	const groups: string[] = input.split("\n\n");
	let i = 0;
	for (const group of groups) {
		const lines = group.split("\n");
		const id = Number(lines[0].split(/[ :]/)[1]);
		const items = lines[1]
			.split(/.*Starting items: /)[1]
			.split(", ")
			.map(x => Number(x));
		const operation = lines[2].split(/Operation: new = (old|\d+) (.) (old|\d+)/).slice(1, 4);
		const test = Number(lines[3].split(/.*Test: divisible by (\d+)/)[1]);
		const ifTrue = lines[4].split(/.*If true: throw to monkey (\d+)/)[1];
		const ifFalse = lines[5].split(/.*If false: throw to monkey (\d+)/)[1];
		// console.log({ id, items, operation, test, ifTrue, ifFalse });
		monkeys[id] = new Monkey(id, items, operation, test, ifTrue, ifFalse);
	}
	return monkeys;
}

function getResult(monkeys: Monkeys) {
	let counts: number[] = [];
	for (const i in monkeys) {
		counts.push(monkeys[i].count);
	}
	counts.sort((a, b) => b - a);
	return counts[0] * counts[1];
}

async function p2022day11_part1(input: string, ...params: any[]) {
	let monkeys: Monkeys = parseInput(input);

	for (const round in _.range(20)) {
		for (const i in monkeys) {
			monkeys[i].takeTurn(monkeys, true);
			// console.log(monkeys[i]);
		}
	}

	return getResult(monkeys);
}

async function p2022day11_part2(input: string, ...params: any[]) {
	let monkeys: Monkeys = parseInput(input);

	// let M = Object.keys(monkeys)
	// 	.map(x => monkeys[x].test)
	// 	.reduce((acc, val) => {
	// 		acc = acc * val;
	// 		return acc;
	// 	}, 1);

	let M = 1;
	for (const i in monkeys) {
		M *= monkeys[i].test;
	}

	for (const round of _.range(10000)) {
		for (const i in monkeys) {
			monkeys[i].takeTurn(monkeys, false, M);
			// console.log(monkeys[i]);
		}
	}

	return getResult(monkeys);
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
			extraArgs: [],
			expected: `10605`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
			extraArgs: [],
			expected: `2713310158`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day11_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day11_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day11_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day11_part2(input));
	const part2After = performance.now();

	logSolution(11, 2022, part1Solution, part2Solution);

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
