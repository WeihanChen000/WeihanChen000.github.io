import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const owner = "WeihanChen000";
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserSite = repository?.toLowerCase() === `${owner}.github.io`.toLowerCase();
const base = process.env.GITHUB_ACTIONS && repository && !isUserSite ? `/${repository}` : "/";

export default defineConfig({
  site: `https://${owner.toLowerCase()}.github.io`,
  base,
  integrations: [react()],
  output: "static",
  trailingSlash: "always"
});
