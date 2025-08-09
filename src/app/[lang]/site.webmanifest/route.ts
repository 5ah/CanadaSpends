import { readFileSync } from "fs";
import { join } from "path";

export function GET() {
  // Always serve the single manifest that lives in /public
  const manifest = readFileSync(
    join(process.cwd(), "public", "site.webmanifest"),
    "utf8",
  );

  return new Response(manifest, {
    headers: {
      "content-type": "application/manifest+json",
      // Cache aggressively – the manifest changes rarely.
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
