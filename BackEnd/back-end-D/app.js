const express = require('express')
const errorController = require('./controllers/error');
const userRoutes = require('./routers/userRoutes');
const terrainRoutre = require('./routers/terrainRoutes');
const terrainDataRoutre = require('./routers/terrainDataRouters');
const terrainVoteRoutre = require('./routers/terrainVoteRouters');
const terrainCommentRoutre = require('./routers/terrainCommentRouters');
const installationRoutre = require('./routers/installationRouters');
const calculationRoutre = require('./routers/calculationRoutre');
const sqlDB = require('./database/mysql');
  
const db = sqlDB.initDB()
const prod = sqlDB.prod
const app = express();
const port = 3000

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}) 

// creade db 
/* app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(['database created ...'])
    })
}) */
function createTableUsers() {
    let sql = `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(50) NOT NULL,
        balance INT(50) DEFAULT 0
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}

function createTableToken() {
    let sql = `CREATE TABLE IF NOT EXISTS auth_tokens (
        id INT PRIMARY KEY UNIQUE NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE 
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}

function createTableInstallations() {
    let sql = `CREATE TABLE IF NOT EXISTS installations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        intervals VARCHAR(50) NOT NULL,
        performance_factors VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        price INT(50) NOT NULL,
        creator_id INT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id)
    );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}

function createTableTerrains() {
    let sql = `CREATE TABLE IF NOT EXISTS terrains (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        price INT(50) NOT NULL,
        creator_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        last_change_time DATETIME NOT NULL,
        last_change_id INT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}
function createTableTerrainsData() {
       let sql = `CREATE TABLE IF NOT EXISTS terrains_data (
        id INT PRIMARY KEY AUTO_INCREMENT,
        data DECIMAL(12,2) NOT NULL,
        type VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        terrain_id INT NOT NULL,
        UNIQUE KEY (year, type, terrain_id),
        FOREIGN KEY (terrain_id) REFERENCES terrains(id) ON DELETE CASCADE
      );`; 
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}
function createTableComments() {
    let sql = `CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content LONGTEXT NOT NULL,
        user_id INT NOT NULL,
        terrain_id INT NOT NULL,
        edit_date DATETIME NOT NULL,
        parent_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (terrain_id) REFERENCES terrains(id) ON DELETE CASCADE,
        CONSTRAINT fk_parent_comment
            FOREIGN KEY (parent_id) REFERENCES comments(id)
            ON DELETE CASCADE
    );
    `;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}
function createTableVotes() {
    let sql = `CREATE TABLE IF NOT EXISTS votes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type BOOLEAN NOT NULL,
        user_id INT NOT NULL,
        terrain_id INT NOT NULL,
        UNIQUE KEY (user_id, terrain_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (terrain_id) REFERENCES terrains(id) ON DELETE CASCADE
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}


function updateTable() {
    let sql = `ALTER TABLE installations
    ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT 'No name';`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}
app.use('/user', userRoutes.initUserRouter(db));
app.use('/terrain', terrainRoutre.initTerrainRouter(db));
app.use('/terrain/data', terrainDataRoutre.initTerrainDataRouter(db));
app.use('/terrain/vote', terrainVoteRoutre.initTerrainVoteRouter(db));
app.use('/terrain/comment', terrainCommentRoutre.initTerrainCommentRouter(db));
app.use('/installation', installationRoutre.initInstallationRouter(db));
app.use('/calculation', calculationRoutre.initCalculationRouter(db));


app.use(errorController.get404);
app.use(errorController.get500);

if (prod) {
    app.listen()
} else {
    app.listen(`${port}`, () => {
        console.log(`Server listening on port ${port}`);
       // updateTable();
       createTableUsers();
        createTableToken();
        createTableTerrains();
        createTableTerrainsData();
        createTableComments();
        createTableVotes();
        createTableInstallations();
    })
}