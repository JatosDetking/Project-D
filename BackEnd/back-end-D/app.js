const express = require('express')
const errorController = require('./controllers/error');
const userRoutes = require('./routers/userRoutes');
const terrainRoutre = require('./routers/terrainRoutes');
const terrainDataRoutre = require('./routers/terrainDataRouters');
const terrainVoteRoutre = require('./routers/terrainVoteRouters');
const terrainCommentRoutre = require('./routers/terrainCommentRouters');
const installationRoutre = require('./routers/installationRouters');
//const suggestionsRoutes = require('./routers/suggestions');
const sqlDB = require('./database/mysql');


//const { initGroupsController } = require('./controllers/groups');
//const { initGroupsRouter } = require('./routers/groups');


const db = sqlDB.initDB()
const prod = sqlDB.prod
const app = express();
const port = 3000

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT');
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
        balance DECIMAL(60,2) DEFAULT 0.00
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}

function createTableInstallations() {
    let sql = `CREATE TABLE IF NOT EXISTS installations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        intervals VARCHAR(50) NOT NULL,
        performance_factors VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        creator_id INT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id)
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
function createTableTerrains() {
    let sql = `CREATE TABLE IF NOT EXISTS terrains (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        price DECIMAL(20,2) NOT NULL,
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
        data DECIMAL(5,2) NOT NULL,
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
        content VARCHAR(255) NOT NULL,
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
/*function createTableComments() {
    let sql = `CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        terrain_id INT NOT NULL,
        edit_date DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (terrain_id) REFERENCES terrains(id) ON DELETE CASCADE
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}
function createTableSubcomments() {
    let sql = `CREATE TABLE IF NOT EXISTS subcomments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        content VARCHAR(255) NOT NULL,
        edit_date DATETIME NOT NULL,
        comment_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
}*/
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
/* function createTableSolarRadiation(){
    let sql = `CREATE TABLE IF NOT EXISTS solar_radiation (
        id INT PRIMARY KEY AUTO_INCREMENT,
        solar_radiation DECIMAL(5,2) NOT NULL,
        year INT NOT NULL,
        terrain_id INT NOT NULL,
        UNIQUE KEY (year, terrain_id),
        FOREIGN KEY (terrain_id) REFERENCES terrains(id)
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);      
    })
} */

// create table
/*app.get('/createpoststable', (req, res) => {
    let sql = `CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(['Posts table created.'])
    })
})*/

/* app.get('/createuserstable', (req, res) => {
    let sql = `CREATE TABLE users (
        email VARCHAR(100) NOT NULL UNIQUE,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        balance DECIMAL(65,30) NOT NULL,
        PRIMARY KEY (email)
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(['Users table created.'])
    })
}) */


/* app.get('/createtokenstable', (req, res) => {
    let sql = `CREATE TABLE auth_tokens (
        email VARCHAR(100) NOT NULL UNIQUE,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        PRIMARY KEY (email),
        UNIQUE KEY (token),
        FOREIGN KEY (email) REFERENCES users(email)
      );`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(['Auth_tokens table created.'])
    })
}) */
/*
app.get('/create-suggestions-table', (req, res) => {
    let sql = `CREATE TABLE suggestions(id int AUTO_INCREMENT, type VARCHAR(255), vals TEXT, PRIMARY KEY(id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(['Suggestions table created.'])
    })
})

app.get('/create-suggestions-table1', (req, res) => {
    let post = {
        type: 'locations',
        vals: JSON.stringify([])
    }
    let sql = 'INSERT INTO suggestions SET ?'
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(['Created locations row.'])
    })
})

app.get('/create-suggestions-table2', (req, res) => {
    let post = {
        type: 'tags',
        vals: JSON.stringify([])
    }
    let sql = 'INSERT INTO suggestions SET ?'
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(['Created tags row.'])
    })
})

// insert post 1

app.get('/addpost1', (req, res) => {
    let post = {
        title: 'Title',
        body: 'asdasd'
    }
    let sql = 'INSERT INTO posts SET ?'
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(['Posted to posts.'])
    })
})

app.get('/drop-table', (req, res) => {
    let table_name = req.query.table_name
    let sql = `DROP TABLE ${table_name}`
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(['Something went wrong with table drop.' + table_name])
            throw err
        } else {
            console.log(`${table_name} table was droped`);
            res.status(200).send(['Group table "' + table_name + '" was deleted successfully.']);
            return;
        }
    })
})

// select posts
app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM posts'
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(['Posts fetched.'])
    })
})

// select post
app.get('/getpost/:id', (req, res) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(['Post fetched.'])
    })
})

// update post
app.get('/updatepost/:id', (req, res) => {
    let newtitle = 'Updated Title';
    let sql = `UPDATE posts SET title = '${newtitle}' WHERE id = ${req.params.id}`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(['Post updated.'])
    })
})

// delete post
app.get('/deletepost/:id', (req, res) => {
    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(['Post deleted.'])
    })
})
*/

app.use('/user', userRoutes.initUserRouter(db));
app.use('/terrain', terrainRoutre.initTerrainRouter(db));
app.use('/terrain/data', terrainDataRoutre.initTerrainDataRouter(db));
app.use('/terrain/vote', terrainVoteRoutre.initTerrainVoteRouter(db));
app.use('/terrain/comment', terrainCommentRoutre.initTerrainCommentRouter(db));
app.use('/installation', installationRoutre.initInstallationRouter(db));
//app.use('/suggestion', suggestionsRoutes.initSuggestionRouter(db));
//app.use('/groups', initGroupsRouter(db));

app.use(errorController.get404);
app.use(errorController.get500);

if (prod) {
    app.listen()
} else {
    app.listen(`${port}`, () => {
        console.log(`Server listening on port ${port}`);
        createTableUsers();
        createTableToken();
        createTableTerrains();
        createTableTerrainsData();
        createTableComments();
       // createTableSubcomments();
        createTableVotes();
        createTableInstallations();
    })
}