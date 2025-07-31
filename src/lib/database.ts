"use client";

import { openDB, IDBPDatabase } from "idb";

const name: string = "qrcode-generator";
const storeName: string = "data";

let dbPromise: Promise<IDBPDatabase> | null = null;

class Database {
  async init(): Promise<IDBPDatabase> {
    if (!dbPromise) {
      dbPromise = openDB(name, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        },
      });
    }

    return dbPromise;
  }

  async get(key: string): Promise<unknown> {
    const db = await this.init();
    return db.get(storeName, key);
  }

  async set(key: string, value: unknown): Promise<IDBValidKey> {
    const db = await this.init();
    return db.put(storeName, value, key);
  }

  async delete(key: string): Promise<void> {
    const db = await this.init();
    return db.delete(storeName, key);
  }
  
  async getAll(): Promise<unknown[]> {
    const db = await this.init();
    return db.getAll(storeName);
  }
}

const database = new Database();
export default database;