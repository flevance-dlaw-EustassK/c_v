export function getStorageItem<T>(key: string): T | null {
  const value = window.localStorage.getItem(key);

  return value === null ? null : (JSON.parse(value) as T);
}

export function setStorageItem<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key: string): void {
  window.localStorage.removeItem(key);
}
