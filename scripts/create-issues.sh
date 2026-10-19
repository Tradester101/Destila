#!/usr/bin/env bash
# Creates the challenge milestones (one per week) and the 30 daily issues on
# GitHub, reading everything from ROADMAP.md (single source of truth).
#
# Usage:
#   scripts/create-issues.sh --dry-run   # print what would be created, no GitHub calls
#   scripts/create-issues.sh             # create labels, milestones and issues
#
# Requirements: gh (authenticated with `gh auth login`), run from inside the repo.
# Safe to re-run: existing milestones are reused and issues whose title already
# exists are skipped.

set -euo pipefail

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROADMAP="$ROOT/ROADMAP.md"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

CHALLENGE_LABEL="reto-30-dias"

# --- Parse ROADMAP.md --------------------------------------------------------
# Writes $WORK/index.tsv (day<TAB>week number<TAB>week title<TAB>day title)
# and one body file per day: $WORK/day-NN.md
awk -v work="$WORK" '
  function close_day() { if (body != "") { close(body) } body = "" }
  /^## Semana [0-9]+:/ {
    close_day()
    week_title = substr($0, 4)
    split(week_title, parts, /[ :]/); week_num = parts[2]
    next
  }
  /^### Día [0-9]+:/ {
    close_day()
    line = substr($0, 5)
    day = line; sub(/^Día /, "", day); sub(/:.*/, "", day)
    title = line; sub(/^Día [0-9]+: */, "", title)
    printf "%02d\t%s\t%s\t%s\n", day, week_num, week_title, title > (work "/index.tsv")
    body = sprintf("%s/day-%02d.md", work, day)
    printf "" > body
    next
  }
  /^## / { close_day(); next }
  body != "" { print >> body }
' "$ROADMAP"

count="$(wc -l < "$WORK/index.tsv" | tr -d " ")"
if [[ "$count" != "30" ]]; then
  echo "Error: ROADMAP.md has $count days, expected 30." >&2
  exit 1
fi

# Append the daily content checklist to every issue body.
for body in "$WORK"/day-*.md; do
  day="$(basename "$body" .md)"; day="${day#day-}"
  cat >> "$body" <<EOF

**Contenido del día:**

- [ ] Commit con el mensaje \`Día $((10#$day)): ...\` que cierra este issue
- [ ] Publicación del día (qué hice, qué aprendí, qué sigue)

_Generado desde ROADMAP.md con scripts/create-issues.sh._
EOF
done

# --- Dry run -----------------------------------------------------------------
if $DRY_RUN; then
  echo "Dry run: nothing will be created on GitHub."
  echo
  cut -f3 "$WORK/index.tsv" | uniq | sed 's/^/Milestone: /'
  echo
  while IFS=$'\t' read -r day week _ title; do
    echo "Issue: Día $day: $title  [semana-$week]"
  done < "$WORK/index.tsv"
  echo
  echo "Example body (Día 01):"
  echo "----------------------"
  cat "$WORK/day-01.md"
  exit 0
fi

# --- Create on GitHub --------------------------------------------------------
command -v gh >/dev/null || { echo "Error: gh is not installed." >&2; exit 1; }
gh auth status >/dev/null || { echo "Error: run 'gh auth login' first." >&2; exit 1; }

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
echo "Repository: $REPO"

echo "Labels..."
gh label create "$CHALLENGE_LABEL" --color "7c3aed" --description "Día del reto de 30 días" --force >/dev/null
for week in 1 2 3 4; do
  gh label create "semana-$week" --color "a78bfa" --description "Semana $week del reto" --force >/dev/null
done
gh label create "idea" --color "0ea5e9" --description "Propuesta de mejora" --force >/dev/null
gh label create "bug" --color "dc2626" --description "Algo no funciona" --force >/dev/null

echo "Milestones..."
existing_milestones="$(gh api "repos/$REPO/milestones?state=all&per_page=100" -q '.[].title')"
cut -f3 "$WORK/index.tsv" | uniq | while read -r milestone; do
  if grep -Fxq "$milestone" <<< "$existing_milestones"; then
    echo "  = $milestone (exists)"
  else
    gh api "repos/$REPO/milestones" -f title="$milestone" >/dev/null
    echo "  + $milestone"
  fi
done

echo "Issues..."
existing_issues="$(gh issue list --repo "$REPO" --state all --limit 500 --json title -q '.[].title')"
while IFS=$'\t' read -r day week week_title title; do
  issue_title="Día $day: $title"
  if grep -Fxq "$issue_title" <<< "$existing_issues"; then
    echo "  = $issue_title (exists)"
    continue
  fi
  gh issue create --repo "$REPO" \
    --title "$issue_title" \
    --body-file "$WORK/day-$day.md" \
    --milestone "$week_title" \
    --label "$CHALLENGE_LABEL" \
    --label "semana-$week" >/dev/null
  echo "  + $issue_title"
done < "$WORK/index.tsv"

echo "Done."
