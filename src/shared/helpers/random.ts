export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function getRandomItem<T>(items: T[]): T {
  return items[getRandomInt(0, items.length - 1)];
}

export function getRandomItems<T>(items: T[], count?: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count ?? getRandomInt(1, items.length));
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}
