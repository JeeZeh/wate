import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";
import path from "path";
import { searchForWorkspaceRoot } from "vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    vite: {
      server: {
        fs: {
          allow: [searchForWorkspaceRoot(process.cwd())],
        },
      },
      resolve: {
        alias: {
          $static: path.resolve("./static"),
        },
      },
    },
  },
};

export default config;
