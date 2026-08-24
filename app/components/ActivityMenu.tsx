"use client";

import Link from "next/link";
import { useState } from "react";
import type { FocusEvent } from "react";

export function ActivityMenu({ years }: { years: string[] }) {
  const [open, setOpen] = useState(false);

  const closeAfterFocusLeaves = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  return (
    <li className="nav-activity-menu" data-open={open || undefined} onBlur={closeAfterFocusLeaves}>
      <span className="nav-activity-label">
        <Link href="/activities">活動記録</Link>
        <button
          className="activity-menu-toggle"
          type="button"
          aria-label="年度別の活動記録を開く"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          ▾
        </button>
      </span>
      <ul className="activity-year-menu" aria-label="年度別の活動記録">
        {years.map((year) => (
          <li key={year}>
            <Link href={`/activities/${year}`} onClick={() => setOpen(false)}>
              {`${year}年度`}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
