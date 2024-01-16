const {Schema, model, default: mongoose} = require('mongoose');

const bookSchema = Schema({
    title: {
        type: String,
        required: [true, "Title for the book is required"],
        min: [5, "Book's title should be at least 5 characters long."]
    },
    author: {
        type: String,
        required: [true, "Author's name is required."],
        min: [2, "Author's name should be at least 2 characters long."]
    },
    publishedYear: {
        type: Number,
        required: [true, "Published year is required."],
        min: 1500,
    },
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: true,
    }
}, {timestamps: true});

const book = model("book", bookSchema);

module.exports = book;