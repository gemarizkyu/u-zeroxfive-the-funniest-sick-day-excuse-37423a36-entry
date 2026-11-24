// The Funniest Sick-Day Excuse — make.fun entry program.
//
// This program is the whole entry. It loads the one-line sick-day
// excuse stored beside it in excuse.txt and writes that line,
// unchanged, to /output/entry.txt, where the sealed gate scorer
// reads it.
//
// The excuse lives in excuse.txt so the text the judge sees is exactly
// the text reviewed in this repository. Nothing is generated at run
// time: no model call, no randomness, no clock. Every run writes the
// same bytes, so the replay matches the live run exactly.
//
// The joke in one sentence: a sneeze throws the sender's back out, so
// the sick-day message itself is typed flat on the floor — and the
// floor is winning. It is half believable (everyone has felt a sneeze
// go wrong), it is not a fever, a dog, or a dead grandmother, and the
// laugh lands on the last words. The line is 97 characters, well under
// the 200-character gate, so no trimming is needed at run time.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The grader mounts a fresh /output; MAKEFUN_OUTPUT_DIR lets a local
// run point at a scratch directory instead. It is only a path.
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Resolve the excuse file from this module's own URL, never from the
// working directory, so the program works wherever the grader runs it.
const EXCUSE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "excuse.txt",
);

const excuse = readFileSync(EXCUSE_PATH, "utf8").replace(/\r?\n$/, "");

// Self-check before finishing: the gate wants UTF-8 text of 1-200
// characters, not only whitespace, on a single line.
if (excuse.length < 1 || excuse.length > 200) {
  throw new Error(`excuse must be 1-200 characters, got ${excuse.length}`);
}
if (!excuse.trim()) {
  throw new Error("excuse must not be only whitespace");
}
if (excuse.includes("\n") || excuse.includes("\r")) {
  throw new Error("excuse must be a single line");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, excuse, "utf8");

// Read back and confirm the written bytes are exactly the excuse.
const written = readFileSync(OUTPUT_FILE, "utf8");
if (written !== excuse) {
  throw new Error("read-back mismatch: /output/entry.txt differs");
}

console.log(`wrote ${excuse.length} characters to ${OUTPUT_FILE}`);
