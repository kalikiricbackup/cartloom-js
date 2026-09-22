import { Product } from "../types";

export function getRandomFourUnique(arr: Product[]) {
  // Return early if the array has fewer than 4 items
  if (arr.length < 4) return [...arr];

  const shuffled = [...arr]; // Copy array to avoid modifying original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 4);
}
