import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");
const client = resolve(output, "client");
const server = resolve(output, "server");

await rm(output, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const filename of [
  "index.html",
  "activities.html",
  "activity.html",
  "how-to.html",
  "organization.html",
  "404.html",
  "style.css",
  "site.js",
  "favicon.png",
  ".nojekyll",
]) {
  await cp(resolve(root, filename), resolve(client, filename));
}

await cp(resolve(root, "images"), resolve(client, "images"), { recursive: true });
await cp(resolve(root, "content"), resolve(client, "content"), { recursive: true });

await writeFile(resolve(server, "index.js"), `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.endsWith("/")) url.pathname += "index.html";
    return env.ASSETS.fetch(new Request(url, request));
  }
};
`);

await mkdir(resolve(output, ".openai"), { recursive: true });
await cp(resolve(root, ".openai", "hosting.json"), resolve(output, ".openai", "hosting.json"));

console.log("Static site built in dist/");
