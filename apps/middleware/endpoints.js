const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'luganopoints'
});

const app = express();

app.use(express.json())

// Fetches all accounts
// An account is a pair of mail, password, pointsBalance and who is referred it to (referredTo)
app.get('/accounts', async (req, res) => {
    const conn = await db.getConnection();
    try {
        const query = "SELECT * FROM accounts";
        const [rows, fields] = await conn.execute(query);
        res.send(rows);
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.release();
    }
});

// Fetches the given uuid
app.get("/accounts/:uuid", async (req, res) => {
    const conn = await db.getConnection();
    try {
        const query = "SELECT * FROM accounts WHERE uuid = ?";
        const [rows, fields] = await conn.execute(query, [req.params.uuid]);
        if (rows.length == 0) {
            res.status(404).send("No account was found with the given uuid");
            return;
        }
        res.send(rows[0]);
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.release();
    }
});

// Add an account to DB
// The password is optional and will be auto-generated if not provided
app.post("/accounts", async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { mail, phoneNumber, password, pointsBalance, referredTo } = req.body;
        if (!mail||!phoneNumber){ res.status(400).send("Mail or phone number not provided"); return; }
        const query = "INSERT INTO accounts (uuid, mail, phoneNumber, password, pointsBalance, referredTo) VALUES (UUID(), ?, ?, ?, ?, ?)";
        const generatedPassword = Array(10).fill(0).map((v,i) => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
        await conn.execute(query, [mail, phoneNumber, password??generatedPassword, pointsBalance??0, referredTo??""]);
        res.status(200).send("Account created");
    } catch (e) {
        res.status(500).send({err: e.message});
    } finally {
        conn.release();
    }
});

// Updates an account
app.put("/accounts/:uuid", async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { mail, phoneNumber, password, pointsBalance, referredTo } = req.body;
        if (!mail||!phoneNumber||!password){ res.status(400).send("Mail or phone number not provided"); return; }
        const query = "UPDATE accounts SET mail = ?, phoneNumber = ?, password = ?, pointsBalance = ?, referredTo = ? WHERE uuid = ?";
        await conn.execute(query, [mail, phoneNumber, password, pointsBalance??0, referredTo??"", req.params.uuid]);
        res.status(200).send("Account updated");
    } catch (e) {
        res.status(500).send({err: e.message});
    } finally {
        conn.release();
    }
});

// Fetches all identities
// An identity is a person, and so is a structure of name, surname, age, and phone number
app.get("/identities", async (req, res) => {
    const conn = await db.getConnection();
    try {
        const query = "SELECT * FROM identitiesMetadata";
        const [rows, fields] = await conn.execute(query);
        res.send(rows);
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.release();
    }
});

// Fetches the given uuid
app.get("/identities/:uuid", async (req, res) => {
    const conn = await db.getConnection();
    try {
        const query = "SELECT * FROM identitiesMetadata WHERE uuid = ?";
        const [rows, fields] = await conn.execute(query, [req.params.uuid]);
        if (rows.length == 0) {
            res.status(404).send("No identity was found with the given uuid");
            return;
        }
        res.send(rows[0]);
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.release();
    }
});

// Creates a new identity
app.post("/identities", async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { name, surname, age } = req.body;
        const query = "INSERT INTO identitiesMetadata (uuid, name, surname, age) VALUES (UUID(), ?, ?, ?)";
        const [rows, fields] = await conn.execute(query, [name, surname, age]);
        res.status(200).send("Identity created");
    } catch (err) {
        res.status(500).send({e: err.message});
    } finally {
        conn.release();
    }
});

// Updates an identity
app.put("/identities/:uuid", async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { name, surname, age } = req.body;
        const query = "UPDATE identitiesMetadata SET name = ?, surname = ?, age = ? WHERE uuid = ?";
        const [rows, fields] = await conn.execute(query, [name, surname, age, req.params.uuid]);
        res.status(200).send("Identity updated");
    } catch (err) {
        res.status(500).send(err);
    } finally {
        conn.release();
    }
});

app.listen(3000, function () {
    console.log('Middleware starting at port 3000');
});