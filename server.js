const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


// DB 생성
const db = new sqlite3.Database('./tasks.db');


// 테이블 생성
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        status TEXT,
        author TEXT
    )
`);


// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// 전체 조회
app.get('/tasks', (req, res) => {

    db.all("SELECT * FROM tasks", [], (err, rows) => {

        if(err) {
            res.status(500).send(err.message);
            return;
        }

        res.json(rows);

    });

});


// 추가
app.post('/tasks', (req, res) => {

    const { title, author } = req.body;

    db.run(

        "INSERT INTO tasks (title, status, author) VALUES (?, ?, ?)",

        [title, "TODO", author],

        function(err) {

            if(err) {
                res.status(500).send(err.message);
                return;
            }

            res.json({
                id: this.lastID,
                title,
                status: "TODO",
                author
            });

        }

    );

});


// 완료 처리
app.put('/tasks/:id', (req, res) => {

    const id = req.params.id;

    const status = req.body.status;

    db.run(

        "UPDATE tasks SET status = ? WHERE id = ?",

        [status, id],

        function(err) {

            if(err) {
                res.status(500).send(err.message);
                return;
            }

            res.send("Updated");

        }

    );

});


// 삭제
app.delete('/tasks/:id', (req, res) => {

    const id = req.params.id;

    db.run(

        "DELETE FROM tasks WHERE id = ?",

        [id],

        function(err) {

            if(err) {
                res.status(500).send(err.message);
                return;
            }

            res.send("Deleted");

        }

    );

});


app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
});