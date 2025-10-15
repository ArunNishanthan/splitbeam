import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRelativeDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  if (diff < minute) {
    return "just now";
  }
  if (diff < hour) {
    const count = Math.round(diff / minute);
    return `${count} min ago`;
  }
  if (diff < day) {
    const count = Math.round(diff / hour);
    return `${count} hr${count === 1 ? "" : "s"} ago`;
  }
  const count = Math.round(diff / day);
  return `${count} day${count === 1 ? "" : "s"} ago`;
}
