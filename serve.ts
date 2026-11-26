// Tiny static server for local previews only (Node 22, standard library).
// Serves app/ at http://localhost:8080 — run `node serve.ts` and open that
// address in a browser. Not part of the entry itself.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "app");
const port = Number(process.argv.find((a) => a.startsWith("--port="))?.split("=")[1] || 8080);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    const path = normalize("/" + (req.url || "/").split("?")[0]).replace(/^\/+/, "");
    const file = join(root, path === "" ? "index.html" : path);
    if (!file.startsWith(root)) throw new Error("outside root");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
});

server.listen(port, () => console.log(`Serving app/ at http://localhost:${port}`));
