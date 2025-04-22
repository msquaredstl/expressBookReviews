const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    return users.some(user => user.username === username && user.password === password);
}
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if both fields are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists." });
    }

    // Add the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
});

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ username }, "access", { expiresIn: '1h' });

    return res.status(200).json({
        message: "Login successful",
        token
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const requestedIsbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    const username = req.user?.username;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized. Username missing from session." });
    }

    let found = false;
    const bookKeys = Object.keys(books);

    bookKeys.forEach(isbn => {
        if (isbn === requestedIsbn) {
            found = true;

            if (!books[isbn].reviews) {
                books[isbn].reviews = {};
            }

            // Add or update the review for the user
            books[isbn].reviews[username] = review;
        }
    });

    if (!found) {
        return res.status(404).json({ message: "Book not found." });
    }

    return res.status(200).json({
        message: "Review submitted successfully.",
        isbn: requestedIsbn,
        user: username,
        review: review
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const requestedIsbn = req.params.isbn;
    const username = req.user?.username;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized. Username missing from token." });
    }

    let found = false;
    const bookKeys = Object.keys(books);

    bookKeys.forEach(isbn => {
        if (isbn === requestedIsbn) {
            found = true;

            if (
                books[isbn].reviews &&
                books[isbn].reviews.hasOwnProperty(username)
            ) {
                delete books[isbn].reviews[username];
                return res.status(200).json({
                    message: "Review deleted successfully.",
                    isbn,
                    user: username
                });
            } else {
                return res.status(404).json({
                    message: "No review by this user found for this book."
                });
            }
        }
    });

    if (!found) {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
