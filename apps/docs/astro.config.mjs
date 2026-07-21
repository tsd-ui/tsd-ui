import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc from "starlight-typedoc";

const base = process.env.DOCS_BASE || "/";

export default defineConfig({
  site: process.env.DOCS_SITE || "https://tsd-ui.github.io",
  base,
  integrations: [
    starlight({
      title: "tsd-ui",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/tsd-ui/tsd-ui" }],
      plugins: [
        starlightTypeDoc({
          entryPoints: [
            "../../packages/core/src/index.ts",
            "../../packages/forms/src/index.ts",
            "../../packages/table-controls/src/index.ts",
          ],
          tsconfig: "./tsconfig.typedoc.json",
          sidebar: { label: "API Reference", collapsed: true },
        }),
      ],
      sidebar: [
        { label: "Getting Started", slug: "getting-started" },
        {
          label: "Core",
          items: [
            {
              label: "Components",
              items: [
                { label: "Theme", slug: "core/components/theme" },
                { label: "LoadingWrapper", slug: "core/components/loading-wrapper" },
              ],
            },
            {
              label: "Utils",
              items: [{ label: "createComparator", slug: "core/utils/universal-comparator" }],
            },
          ],
        },
        {
          label: "Guides",
          items: [{ label: "Architecture", slug: "guides/architecture" }],
        },
      ],
    }),
  ],
});
