#!/bin/bash
# Publish the PUBLIC files to gh-pages from an isolated worktree.
# Target: https://sindrimar02.github.io/port9-preview/ (noindex).
# Never checkout gh-pages inside the main tree: its files live at the repo
# root, so clearing the root there would delete the real source.
# The local server is deliberately NOT published — a client preview must
# never expose internal tooling.
set -e
REPO="$(cd "$(dirname "$0")" && pwd)"
WT="$(mktemp -d)/port9-pages"

git -C "$REPO" worktree add --detach -q "$WT"
cd "$WT"
git branch -D gh-pages >/dev/null 2>&1 || true
git checkout -q --orphan gh-pages
git rm -rq --cached . >/dev/null 2>&1 || true
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +

cp -R "$REPO/assets" .
cp "$REPO/index.html" "$REPO/styles.css" "$REPO/app.js" "$REPO/robots.txt" .
touch .nojekyll

# CACHE BUST — the hard-won one. GitHub Pages serves every file here with
# max-age=600, and the photographs were REPLACED at their original filenames
# (10 of 13 re-pulled at full size on 2026-09-10). A phone that already opened
# this preview therefore holds the old bytes at exactly the URLs the new build
# asks for, and renders a mixture of the two. Hash the bytes into the URL so a
# changed file is a changed URL. Images first, then the stylesheet and script —
# their own hashes must be taken AFTER their image references are rewritten.
node --input-type=module - "$WT" <<'STAMP'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const root = process.argv[2];
const files = ['index.html', 'styles.css', 'app.js'];
const h8 = p => createHash('md5').update(readFileSync(p)).digest('hex').slice(0, 8);
const stamp = (src, ref, v) =>
  src.replace(new RegExp(ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w.?-])', 'g'),
              `${ref}?v=${v}`);

const img = readdirSync(join(root, 'assets/img'))
  .map(f => [`assets/img/${f}`, h8(join(root, 'assets/img', f))]);

for (const f of files) {
  const p = join(root, f);
  let s = readFileSync(p, 'utf8');
  for (const [ref, v] of img) s = stamp(s, ref, v);
  writeFileSync(p, s);
}

const page = join(root, 'index.html');
let html = readFileSync(page, 'utf8');
for (const f of ['styles.css', 'app.js']) html = stamp(html, f, h8(join(root, f)));
writeFileSync(page, html);

const n = [...img, 'styles.css', 'app.js'].length;
console.log(`cache-bust: ${n} assets fingerprinted`);
STAMP


# GATE 1 — check the STAGED tree, byte-for-byte what gets published. A preview that
# ships without a usable favicon shows the ARTIX helm from the origin root in the
# client's tab. Rules and history: _tools/favicon-guard.mjs
node "$REPO"/../../_tools/favicon-guard.mjs "$WT"

git add -A
git -c user.email=sindri@klubbr.is -c user.name="Sindri Már" \
    commit -q -m "Deploy $(git -C "$REPO" rev-parse --short HEAD) (noindex preview)"
git push -q -f origin gh-pages
cd "$REPO"
git worktree remove --force "$WT"
echo "published:"; git -C "$REPO" ls-tree --name-only origin/gh-pages

# GATE 2 — on-disk correct is not proof the client sees an icon: the build can rename
# files and the Pages CDN takes a minute. Check the DEPLOYED url. Polls ~3 min.
node "$REPO"/../../_tools/favicon-verify-live.mjs "https://sindrimar02.github.io/port9-preview/"
