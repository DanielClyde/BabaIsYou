export enum StorageKey {
  CONTROLS = 'bbiy-cs5410-controls',
};

export class StorageDriver {
  getObj<T>(key: StorageKey): T | null {
    const str = localStorage.getItem(key);
    if (str) {
      return JSON.parse(str);
    } else {
      return null;
    }
  }

  getStr(key: StorageKey): string | null {
    return localStorage.getItem(key);
  }

  setStr(key: StorageKey, str: string): string {
    localStorage.setItem(key, str);
    return str;
  }

  setObj<T>(key: StorageKey, obj: T): T {
    localStorage.setItem(key, JSON.stringify(obj));
    return obj;
  }
}
