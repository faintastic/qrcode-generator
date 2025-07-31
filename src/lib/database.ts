"use client";

import { openDB } from "idb";

const name: string = "qrcode-generator";
const storeName: string = "data";

let dbPromise: any;

class Database {
  async init() {
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

  async get(key:string) {
    const db = await this.init();
    return db.get(storeName, key);
  }

  async set(key: string, value: any) {
    const db = await this.init();
    return db.put(storeName, value, key);
  }

  async delete(key: string) {
    const db = await this.init();
    return db.delete(storeName, key);
  }
  
  async getAll() {
    const db = await this.init();
    return db.getAll(storeName);
  }
}

const database = new Database();
export default database;