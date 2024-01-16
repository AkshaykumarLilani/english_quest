const asyncHandler = require("express-async-handler");
const { createBook, getPaginatedBooksList, getOwnBooks, getNonPaginatedBooks } = require("../services/book.service");
const { USER_ROLES } = require("../config/enums");
const logger = require("../config/winston.logger");

const saveABook = asyncHandler(async (req, res) => {
    const body = req.body;

    const new_book = {
        author: body.author,
        title: body.title,
        publishedYear: body.publishedYear,
        creator: req.user._id
    }

    const book = createBook(new_book);
    await book.save();

    logger.info({ book });

    return res.status(200).json({
        book
    })
});

const getAllBooks = asyncHandler(async (req, res) => {
    const roles = req.user.role;
    const hasViewAllPermission = roles.filter(r => r === USER_ROLES.VIEW_ALL).length > 0;
    const hasViewerPermission = roles.filter(r => r === USER_ROLES.VIEWER).length > 0;

    const query = req.query;
    logger.info(query)

    const pageNo = Number(query.page) || 1;
    const pageSize = query.page_size || process.env.PAGINATION_SIZE || 8;
    const new_ = query.new;
    const old_ = query.old;
    logger.info({
        pageNo, pageSize, new_, old_
    });

    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

    if (hasViewAllPermission) {
        let books = {};
        if (Number(new_) === 1) {
            // show books that are created in the last 10 minutes
            const filter = { createdAt: { $gte: tenMinutesAgo, $lt: new Date() } };
            books = await getNonPaginatedBooks(filter);
        } else if (Number(old_) === 1) {
            // show books that were created 10 or more minutes ago
            const filter = { createdAt: { $lt: tenMinutesAgo } };
            books = await getNonPaginatedBooks(filter);
        } else {
            books = await getPaginatedBooksList(pageNo, pageSize);
        }
        return res.status(200).json(books);
    } else if (hasViewerPermission) {
        const books = await getOwnBooks(req.user._id, pageNo, pageSize);
        return res.status(200).json(books);
    } else {
        // this should never happen since canView middleware checks this condition
    }
});

module.exports = {
    saveABook,
    getAllBooks
}