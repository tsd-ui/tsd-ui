/// <reference types="node" />
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Architectural boundary enforcement tests.
 *
 * These tests verify that the core layer does not import any UI-framework
 * or app-specific modules. This is a key invariant of the layered
 * architecture defined in docs/architecture.md.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORE_SRC = path.resolve(__dirname);

const ALLOWED_IMPORTS = [
  // node built-in modules
  "node:",
  // testing utilities
  "vitest",
  // self-reference allowed
  "@tsd-ui/core",
  // standard libs & utils
  "react", // React itself is allowed (for types), but not react-dom
  // Patternfly dependencies
  "@patternfly/",
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

describe("architectural boundaries", () => {
  const sourceFiles = collectTsFiles(CORE_SRC);

  it("has source files to validate", () => {
    expect(sourceFiles.length).toBeGreaterThan(0);
  });

  for (const file of sourceFiles) {
    const relPath = path.relative(CORE_SRC, file);

    it(`${relPath} only imports from allowed modules`, () => {
      const content = fs.readFileSync(file, "utf-8");

      // extract all import statements
      const importRegex = /(?:from|require\()\s*["']([^"']+)["']/g;
      const imports = [...content.matchAll(importRegex)]
        .map((match) => match[1])
        .filter((imp): imp is string => imp !== undefined);

      for (const importPath of imports) {
        // check if import is relative (starts with . or ..)
        if (importPath.startsWith(".")) {
          continue; // relative imports are always allowed
        }

        const isAllowed = ALLOWED_IMPORTS.some((allowed) => importPath.startsWith(allowed));
        expect(
          isAllowed,
          `Found disallowed import "${importPath}" in ${relPath}. Only imports starting with [${ALLOWED_IMPORTS.join(", ")}] are allowed.`,
        ).toBe(true);
      }
    });
  }

  it("core package.json has no UI framework dependencies", () => {
    const pkgPath = path.resolve(__dirname, "..", "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.peerDependencies,
    };

    expect(allDeps).not.toHaveProperty("@patternfly/react-table");
  });
});
