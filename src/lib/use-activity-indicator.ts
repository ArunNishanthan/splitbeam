"use client";

import * as React from "react";

import type { Activity } from "@/types/entities";

const STORAGE_KEY = "splitbeam.activity.lastViewed";

function readStoredTimestamp() {
  if (typeof window === "undefined") {
    return 0;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return 0;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function writeStoredTimestamp(value: number) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, value.toString());
}

export function useActivityIndicator(activity: Activity[]) {
  const [lastViewed, setLastViewed] = React.useState<number>(() => readStoredTimestamp());

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setLastViewed(event.newValue ? Number.parseInt(event.newValue, 10) || 0 : 0);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const markAsSeen = React.useCallback(
    (timestamp?: number) => {
      const value = timestamp ?? Date.now();
      setLastViewed(value);
      writeStoredTimestamp(value);
    },
    [],
  );

  const hasUnseen = React.useMemo(() => {
    if (!activity.length) {
      return false;
    }
    const newest = activity.reduce((latest, item) => {
      const created = new Date(item.created_at).getTime();
      return created > latest ? created : latest;
    }, 0);
    return newest > lastViewed;
  }, [activity, lastViewed]);

  return { hasUnseen, markAsSeen, lastViewed };
}
