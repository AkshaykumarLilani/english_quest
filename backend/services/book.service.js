const Book = require('../models/book.model');

const createBook = (book) => {
    return Book(book);
}

const getPaginatedBooksList = (page = 1, page_size = 10, sortBy = { createdAt: -1 }, filter = {}) => {
    return Book.find(filter).sort(sortBy)
        .limit(page_size)
        .skip(Number(page_size) * (page - 1)).populate('creator', { email: 1, _id: 1 });
}

const getOwnBooks = (user_id, page = 1, page_size = 10, sortBy = { createdAt: -1 }) => {
    return Book.find({ creator: user_id }).sort(sortBy)
        .limit(page_size)
        .skip(Number(page_size) * (page - 1)).populate('creator', { email: 1, _id: 1 });
}

const getNonPaginatedBooks = (filter) => {
    return Book.find(filter).sort({ createdAt: -1 });
}

module.exports = {
    createBook,
    getPaginatedBooksList,
    getOwnBooks,
    getNonPaginatedBooks
}