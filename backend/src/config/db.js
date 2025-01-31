const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

let db;

const checkAndCreateFolder = async (folderPath) => {
    try {
        // Check if the folder exists
        await fs.access(folderPath);
        // console.log('Folder already exists');
    } catch (err) {
        // If the folder doesn't exist, create it
        await fs.mkdir(folderPath, { recursive: true });
        console.log('Folder created successfully');
    }
};


const connectDB = async () => {
    let dbFolder = path.join(__dirname, '../../db-file');
    await checkAndCreateFolder(dbFolder)
    const dbPath = path.join(dbFolder, 'chatNotes.db');
    return db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database', err);
        } else {
            console.log('Connected to SQLite database');
            createTables();
        }
    });
};



// Create tables
const createTables = () => {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT DEFAULT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            topic_id INTEGER NOT NULL,
            messages TEXT,
            files TEXT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
            FOREIGN KEY (topic_id) REFERENCES topics(id)
        )`
    );
};

const createUser = (name, email, password, callback) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (name,email, password) VALUES (?, ?, ?)', [name,email, hashedPassword], callback);
};

const findUserByUsername = (email, callback) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
};

const findUserById = (id,callback) =>{
    db.get('SELECT * FROM users WHERE id = ?',[id],callback);
}




module.exports = {
connectDB, 
createTables, 
createUser,
findUserByUsername,
findUserById
};