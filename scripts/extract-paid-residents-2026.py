import argparse
import json
from pathlib import Path

import pandas as pd


def clean(value):
    if pd.isna(value):
        return None
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip()


def main():
    parser = argparse.ArgumentParser(
        description="Extract 2026 paid resident levy rows from the Excel workbook."
    )
    parser.add_argument("xlsx", help="Path to Paid Up Residents List workbook")
    parser.add_argument(
        "--sheet",
        default="Sheet1",
        help="Workbook sheet containing the 2026 column",
    )
    parser.add_argument(
        "--output",
        default="tmp/paid-residents-2026.json",
        help="Output JSON path",
    )
    args = parser.parse_args()

    workbook_path = Path(args.xlsx)
    output_path = Path(args.output)

    df = pd.read_excel(workbook_path, sheet_name=args.sheet)
    amount_series = pd.to_numeric(df[2026], errors="coerce")
    df = df[amount_series.notna()].copy()
    df["amount2026"] = amount_series[amount_series.notna()]

    rows = []
    for index, row in df.iterrows():
        rows.append(
            {
                "sourceRow": int(index) + 2,
                "serialNumber": clean(row.get("S/N")),
                "name": clean(row.get("NAMES")),
                "houseNo": clean(row.get("HOUSE NO.")),
                "street": clean(row.get("STREET")),
                "category": clean(row.get("CATEGORY")),
                "apartmentTypeLabel": clean(row.get("Unnamed: 9")),
                "amount": float(row["amount2026"]),
            }
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    print(
        json.dumps(
            {
                "input": str(workbook_path),
                "sheet": args.sheet,
                "output": str(output_path),
                "rows": len(rows),
                "totalAmount": round(sum(row["amount"] for row in rows), 2),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
