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

const FORBIDDEN_IMPORTS = [
  // UI frameworks — core must remain headless
  "@patternfly",
  "react-dom",
  // App-specific modules
  "@app/",
  "@tackle-ui",
  // Wrapper packages must not be imported by core
  "@tsd-ui/forms",
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

describe("architectural boundaries", () => {
  const sourceFiles = collectTsFiles(CORE_SRC);

  it("has source files to validate", () => {
    expect(sourceFiles.length).toBeGreaterThan(0);
  });

  for (const file of sourceFiles) {
    const relPath = path.relative(CORE_SRC, file);

    it(`${relPath} does not import forbidden modules`, () => {
      const content = fs.readFileSync(file, "utf-8");
      for (const forbidden of FORBIDDEN_IMPORTS) {
        const hasImport =
          content.includes(`from "${forbidden}`) ||
          content.includes(`from '${forbidden}`) ||
          content.includes(`require("${forbidden}`) ||
          content.includes(`require('${forbidden}`);
        expect(hasImport, `Found forbidden import "${forbidden}" in ${relPath}`).toBe(false);
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

    expect(allDeps).not.toHaveProperty("@patternfly/react-core");
    expect(allDeps).not.toHaveProperty("@patternfly/react-table");
    expect(allDeps).not.toHaveProperty("react-dom");
  });
});
