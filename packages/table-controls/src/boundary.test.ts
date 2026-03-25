import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Wrapper layer boundary enforcement for @tsd-ui/table-controls.
 *
 * This package MAY import from @tsd-ui/core and PatternFly,
 * but MUST NOT import app-specific modules.
 */

const TC_SRC = path.resolve(__dirname);

const ALLOWED_IMPORTS = [
  // Node built-in modules
  "node:",
  // Testing utilities
  "vitest",
  // Core package
  "@tsd-ui/core",
  // UI framework (PatternFly and React)
  "@patternfly",
  "react",
  "react-dom",
  // Self-reference
  "@tsd-ui/table-controls",
];

function collectTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(fullPath));
    } else if (/\.tsx?$/.test(entry.name) && !entry.name.includes(".test.")) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("table-controls layer boundaries", () => {
  const sourceFiles = collectTsFiles(TC_SRC);

  it("has source files to validate", () => {
    expect(sourceFiles.length).toBeGreaterThan(0);
  });

  for (const file of sourceFiles) {
    const relPath = path.relative(TC_SRC, file);

    it(`${relPath} only imports from allowed modules`, () => {
      const content = fs.readFileSync(file, "utf-8");

      // Extract all import statements
      const importRegex = /(?:from|require\()\s*["']([^"']+)["']/g;
      const imports = [...content.matchAll(importRegex)]
        .map((match) => match[1])
        .filter((imp): imp is string => imp !== undefined);

      for (const importPath of imports) {
        // Check if import is relative (starts with . or ..)
        if (importPath.startsWith(".")) {
          continue; // Relative imports are always allowed
        }

        // Check if import matches any allowed prefix
        const isAllowed = ALLOWED_IMPORTS.some((allowed) => importPath.startsWith(allowed));
        expect(
          isAllowed,
          `Found disallowed import "${importPath}" in ${relPath}. Only imports starting with [${ALLOWED_IMPORTS.join(", ")}] are allowed.`,
        ).toBe(true);
      }
    });
  }
});
