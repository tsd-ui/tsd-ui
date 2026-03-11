import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Wrapper layer boundary enforcement for @tsd-ui/forms.
 *
 * Wrapper packages MAY import from @tsd-ui/core and PatternFly,
 * but MUST NOT import app-specific modules.
 */

const FORMS_SRC = path.resolve(__dirname);

const FORBIDDEN_IMPORTS = ["@app/", "@tackle-ui", "@tsd-ui/table-controls"];

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

describe("forms layer boundaries", () => {
  const sourceFiles = collectTsFiles(FORMS_SRC);

  it("has source files to validate", () => {
    expect(sourceFiles.length).toBeGreaterThan(0);
  });

  for (const file of sourceFiles) {
    const relPath = path.relative(FORMS_SRC, file);

    it(`${relPath} does not import app-specific modules`, () => {
      const content = fs.readFileSync(file, "utf-8");
      for (const forbidden of FORBIDDEN_IMPORTS) {
        const hasImport =
          content.includes(`from "${forbidden}`) || content.includes(`from '${forbidden}`);
        expect(hasImport, `Found forbidden import "${forbidden}" in ${relPath}`).toBe(false);
      }
    });
  }
});
