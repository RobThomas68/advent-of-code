import _, { update } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import * as graph from "../../../util/graph";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { dir } from "console";

const YEAR = 2022;
const DAY = 7;

// solution path: /home/rob/Workspaces/advent-of-code/years/2022/07/index.ts
// data path    : /home/rob/Workspaces/advent-of-code/years/2022/07/data.txt
// problem url  : https://adventofcode.com/2022/day/7

async function p2022day7_part1(input: string, ...params: any[]) {
	let nodeChildrenMap = new Map<string, Array<string>>();

	function getNeighbors(key: string) {
		const children = nodeChildrenMap.get(key);
		if (children) {
			return children;
		} else {
			return [];
		}
	}

	function calcDirectorySize(dirNode: string) {
		let directorySize = 0;

		const nodes = Array.from(
			graph.bfTraverse({
				start: dirNode,
				neighbors: getNeighbors,
				allPaths: true,
			})
		);

		for (const n of nodes) {
			const node = JSON.parse(n.node);
			if (node.type === "file") {
				directorySize += node.size;
			}
		}
		return directorySize;
	}

	const lines: string[] = input.split("\n");
	let cwd = new Array<string>();

	function addChild(node: { type: string; name: string; cwd?: string; size?: number }) {
		const key = JSON.stringify({ type: "dir", name: cwd.at(-1), cwd: String(cwd.slice(0, -1)) });
		const children = nodeChildrenMap.get(key) || new Array<string>();
		children.push(JSON.stringify(node));
		nodeChildrenMap.set(key, children);
	}

	function getNode(node: { type: string; name: string; cwd?: string; size?: number }) {
		node.cwd = String(cwd);
		return node;
	}

	for (const [i, line] of lines.entries()) {
		const parts = line.split(" ");

		// Command Input
		if (parts[0] === "$") {
			const command = parts[1];
			// log({ msg: "COMMAND: BEFORE cd", cwd });
			if (parts.length === 3 && command === "cd") {
				const name = parts[2];
				if (name === "..") {
					cwd.pop();
				} else {
					cwd.push(name);
				}
				// log({ msg: "COMMAND: AFTER cd", name, cwd });
			} else if (parts.length === 2 && command === "ls") {
				// log(JSON.stringify({ msg: "COMMAND: ls", cwd }));
			} else {
				log({ msg: "*** ERROR *** Invalid Command", i, line });
			}

			// Command Output
		} else if (parts.length === 2) {
			if (parts[0] === "dir") {
				const node = getNode({ type: "dir", name: parts[1] });
				addChild(node);
				// log({ msg: "OUTPUT: Directory", node });
			} else if (!isNaN(Number(parts[0])) && parts.length === 2) {
				const node = getNode({ type: "file", name: parts[1], size: Number(parts[0]) });
				addChild(node);
				// log({ msg: "OUTPUT: File", node });
			}
		} else {
			log({ msg: "*** ERROR*** Unable to parse input line", i, line });
		}
	}

	let size = 0;
	for (const dirNode of nodeChildrenMap.keys()) {
		let directorySize = calcDirectorySize(dirNode);
		if (directorySize <= 100000) {
			size += directorySize;
		}
	}
	return size;
}

async function p2022day7_part2(input: string, ...params: any[]) {
	let nodeChildrenMap = new Map<string, Array<string>>();

	function getNeighbors(key: string) {
		const children = nodeChildrenMap.get(key);
		if (children) {
			return children;
		} else {
			return [];
		}
	}

	function calcDirectorySize(dirNode: string) {
		let directorySize = 0;

		const nodes = Array.from(
			graph.bfTraverse({
				start: dirNode,
				neighbors: getNeighbors,
				allPaths: true,
			})
		);

		for (const n of nodes) {
			const node = JSON.parse(n.node);
			if (node.type === "file") {
				directorySize += node.size;
			}
		}
		return directorySize;
	}

	const lines: string[] = input.split("\n");
	let cwd = new Array<string>();

	function addChild(node: { type: string; name: string; cwd?: string; size?: number }) {
		const key = JSON.stringify({ type: "dir", name: cwd.at(-1), cwd: String(cwd.slice(0, -1)) });
		const children = nodeChildrenMap.get(key) || new Array<string>();
		children.push(JSON.stringify(node));
		nodeChildrenMap.set(key, children);
	}

	function getNode(node: { type: string; name: string; cwd?: string; size?: number }) {
		node.cwd = String(cwd);
		return node;
	}

	for (const [i, line] of lines.entries()) {
		const parts = line.split(" ");

		// Command Input
		if (parts[0] === "$") {
			const command = parts[1];
			// log({ msg: "COMMAND: BEFORE cd", cwd });
			if (parts.length === 3 && command === "cd") {
				const name = parts[2];
				if (name === "..") {
					cwd.pop();
				} else {
					cwd.push(name);
				}
				// log({ msg: "COMMAND: AFTER cd", name, cwd });
			} else if (parts.length === 2 && command === "ls") {
				// log(JSON.stringify({ msg: "COMMAND: ls", cwd }));
			} else {
				log({ msg: "*** ERROR *** Invalid Command", i, line });
			}

			// Command Output
		} else if (parts.length === 2) {
			if (parts[0] === "dir") {
				const node = getNode({ type: "dir", name: parts[1] });
				addChild(node);
				// log({ msg: "OUTPUT: Directory", node });
			} else if (!isNaN(Number(parts[0])) && parts.length === 2) {
				const node = getNode({ type: "file", name: parts[1], size: Number(parts[0]) });
				addChild(node);
				// log({ msg: "OUTPUT: File", node });
			}
		} else {
			log({ msg: "*** ERROR*** Unable to parse input line", i, line });
		}
	}

	const totalAvailableSpace = 70000000;
	const updateSize = 30000000;
	const dirNode = [...nodeChildrenMap.keys()][0];

	let directorySize = calcDirectorySize(dirNode);

	let freeSpace = totalAvailableSpace - directorySize;

	let dirSizes = new Array<{ size: number; node: string }>();

	for (const dirNode of nodeChildrenMap.keys()) {
		let directorySize = calcDirectorySize(dirNode);
		dirSizes.push({ size: directorySize, node: dirNode });
	}

	dirSizes.sort((a: { size: number; node: string }, b: { size: number; node: string }) => a.size - b.size);

	for (const dir of dirSizes) {
		if (freeSpace + dir.size > updateSize) {
			return dir.size;
		}
	}
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
			extraArgs: [],
			expected: `95437`,
		},
	];
	const part2tests: TestCase[] = [
		{
			input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
			extraArgs: [],
			expected: `24933642`,
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2022day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2022, part1Solution, part2Solution);

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
