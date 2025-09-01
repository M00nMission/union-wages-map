#!/usr/bin/env python3
"""
Scrape the IBEW Electricians pay table from unionpayscales.com and save as JSON.

Usage:
    python scrape_union_payscales.py \
        --url https://unionpayscales.com/trades/ibew-electricians/ \
        --out ibew_electricians.json
"""
import argparse
import json
import sys
import time
from typing import List, Dict, Optional

import requests
from bs4 import BeautifulSoup

DEFAULT_URL = "https://unionpayscales.com/trades/ibew-electricians/"


def fetch_html(url: str, retries: int = 3, timeout: int = 20) -> str:
    """Fetch page HTML with a desktop user-agent and light retry logic."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/127.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Connection": "keep-alive",
    }
    last_err: Optional[Exception] = None
    for attempt in range(1, retries + 1):
        try:
            resp = requests.get(url, headers=headers, timeout=timeout)
            resp.raise_for_status()
            return resp.text
        except Exception as e:
            last_err = e
            # brief backoff
            time.sleep(min(1.5 * attempt, 4.0))
    raise RuntimeError(f"Failed to fetch {url}: {last_err}")


def clean(text: str) -> str:
    """Normalize whitespace and strip stray characters."""
    if text is None:
        return ""
    return " ".join(text.replace("\xa0", " ").split()).strip()


def table_to_records(table) -> List[Dict[str, str]]:
    """Convert an HTML <table> to list of dicts (records)."""
    # headers may be in thead or first tr
    headers: List[str] = []
    thead = table.find("thead")
    if thead:
        header_cells = thead.find_all(["th", "td"])
        headers = [clean(th.get_text(" ")) for th in header_cells if clean(th.get_text(" "))]
    # Fallback to first row as header
    if not headers:
        first_tr = table.find("tr")
        if first_tr:
            header_cells = first_tr.find_all(["th", "td"])
            headers = [clean(th.get_text(" ")) for th in header_cells if clean(th.get_text(" "))]
            # remove the header row from tbody processing if we used it
            first_tr.extract()

    # If headers are still empty, just index columns numerically
    if not headers:
        # inspect first body row to count columns
        body_first = table.find("tr")
        ncols = len(body_first.find_all(["td", "th"])) if body_first else 0
        headers = [f"col_{i+1}" for i in range(ncols)]

    records: List[Dict[str, str]] = []
    # Prefer tbody rows; fallback to all trs
    body = table.find("tbody")
    rows = body.find_all("tr") if body else table.find_all("tr")

    for tr in rows:
        cells = tr.find_all(["td", "th"])
        if not cells:
            continue
        values = [clean(td.get_text(" ")) for td in cells]
        # skip entirely empty rows
        if not any(values):
            continue
        # pad/truncate to header length
        if len(values) < len(headers):
            values += [""] * (len(headers) - len(values))
        if len(values) > len(headers):
            values = values[: len(headers)]
        records.append(dict(zip(headers, values)))
    return records


def pick_target_table(soup: BeautifulSoup):
    """
    Heuristically pick the main pay table.
    Criteria:
      - Table with many rows
      - Header contains keywords like 'Local', 'IBEW', 'Rate', 'Journeyman'
    """
    keyword_score_cols = ("local", "ibew", "rate", "wage", "classification", "journeyman", "benefit", "fringe", "zone")
    tables = soup.find_all("table")
    if not tables:
        return None

    best = None
    best_score = -1
    for tbl in tables:
        # score by number of rows
        rows = tbl.find_all("tr")
        score = len(rows)
        # add keyword score from headers
        header_text = ""
        if tbl.find("thead"):
            header_text = clean(tbl.find("thead").get_text(" ").lower())
        else:
            first_tr = tbl.find("tr")
            if first_tr:
                header_text = clean(first_tr.get_text(" ").lower())
        for kw in keyword_score_cols:
            if kw in header_text:
                score += 10
        # favor wide tables (many columns)
        first_row = tbl.find("tr")
        if first_row:
            ncols = len(first_row.find_all(["td", "th"]))
            score += ncols
        if score > best_score:
            best = tbl
            best_score = score
    return best


def scrape(url: str) -> Dict[str, object]:
    """Scrape the page and return a dict with metadata and records."""
    html = fetch_html(url)
    soup = BeautifulSoup(html, "lxml")

    table = pick_target_table(soup)
    if table is None:
        raise RuntimeError("No HTML <table> elements found on the page. Has the site changed?")

    records = table_to_records(table)
    if not records:
        raise RuntimeError("Found a table, but could not parse any rows.")

    return {
        "source_url": url,
        "record_count": len(records),
        "fields": list(records[0].keys()),
        "data": records,
    }


def main():
    ap = argparse.ArgumentParser(description="Scrape unionpayscales.com IBEW pay table to JSON")
    ap.add_argument("--url", default=DEFAULT_URL, help="Page URL to scrape")
    ap.add_argument("--out", default="ibew_electricians.json", help="Path to write JSON output")
    ap.add_argument("--indent", type=int, default=2, help="JSON indent level (default: 2)")
    args = ap.parse_args()

    try:
        result = scrape(args.url)
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=args.indent)

    print(f"Wrote {result['record_count']} records to {args.out}")
    print(f"Fields: {', '.join(result['fields'])}")


if __name__ == "__main__":
    main()
