import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseAsync("photos.db");

export const setupDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        fullPath TEXT NOT NULL,
        uploaded BOOLEAN NOT NULL
      );`,
      [],
      () => {
        console.log("Database setup completed.");
      },
      (error) => {
        console.error("Error setting up database:", error);
      }
    );
  });
};

export const getDatabase = () => db;
