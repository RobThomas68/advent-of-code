import _, { fromPairs, padStart } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { parse } from "path";

const YEAR = 2021;
const DAY = 4;

// solution path: /home/rob/Workspaces/advent-of-code/years/2021/04/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2021/04/data.txt
// problem url  : https://adventofcode.com/2021/day/4

class Card {
	private card: string[][] = [];
	private numbers: number[][] = [];
	private lastNumber: number = 0;

	colCount() {
		return this.card[0].length;
	}

	rowCount() {
		return this.card.length;
	}

	addRow(row: string[]) {
		this.card.push(row);
		this.numbers.push(new Array(row.length).fill(0));
	}

	addNumber(number: number) {
		this.lastNumber = number;
		for (const [r, row] of this.card.entries()) {
			for (const [c, col] of row.entries()) {
				if (col === number.toString()) {
					this.numbers[r][c] = 1;
				}
			}
		}
	}

	isWinner() {
		for (const row of this.numbers) {
			if (row.reduce((a, b) => a + b) === this.rowCount()) {
				return true;
			}
		}
		for (const c of util.range(0, this.colCount())) {
			let nums = [];
			for (const r of util.range(0, this.rowCount())) {
				nums.push(this.numbers[r][c]);
			}
			if (nums.reduce((a, b) => a + b) === this.rowCount()) {
				return true;
			}
		}
		return false;
	}

	score() {
		let score = 0;
		for (const [r, row] of this.card.entries()) {
			for (const [c, col] of row.entries()) {
				if (this.numbers[r][c] === 0) {
					score += Number(col);
				}
			}
		}
		return score * this.lastNumber;
	}

	log() {
		for (const row of this.card) {
			log(row.map(x => padStart(x, 2)));
		}
	}
}

const parseInput = (input: string): [Card[], number[]] => {
	const lines = input.split("\n");

	const numbers = lines[0].split(",").map(x => Number(x));
	const cardLines = lines.slice(1);

	const cards = new Array<Card>();
	let card = new Card();
	for (const line of cardLines) {
		const row = line
			.trim()
			.split(/\s+/)
			.filter(x => x !== "");
		if (row.length) {
			card.addRow(row);
			if (card.rowCount() === row.length) {
				cards.push(card);
				card = new Card();
			}
		}
	}

	return [cards, numbers];
};

async function p2021day4_part1(input: string, ...params: any[]) {
	let cards: Array<Card> = [];
	let numbers: number[] = [];

	[cards, numbers] = parseInput(input);

	for (const [n, number] of numbers.entries()) {
		for (const [c, card] of cards.entries()) {
			card.addNumber(number);
			if (card.isWinner()) {
				// console.log({ n, c, score: card.score() });
				return card.score();
			}
		}
	}
}

async function p2021day4_part2(input: string, ...params: any[]) {
	let cards: Array<Card> = [];
	let numbers: number[] = [];
	let winningCards: Array<Card> = [];

	[cards, numbers] = parseInput(input);

	for (const [n, number] of numbers.entries()) {
		for (const [c, card] of cards.entries()) {
			if (!winningCards.find(x => x === card)) {
				card.addNumber(number);
				if (card.isWinner()) {
					winningCards.push(card);
					if (winningCards.length === cards.length) {
						// console.log({ n, c, score: card.score() });
						return card.score();
					}
				}
			}
		}
	}
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
8  2 23  4 24
21  9 14 16  7
6 10  3 18  5
1 12 20 15 19

3 15  0  2 22
9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
2  0 12  3  7`,
			extraArgs: [],
			expected: `4512`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
8  2 23  4 24
21  9 14 16  7
6 10  3 18  5
1 12 20 15 19

3 15  0  2 22
9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
2  0 12  3  7`,
			extraArgs: [],
			expected: `1924`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2021day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2021day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2021day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2021day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2021, part1Solution, part2Solution);

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
