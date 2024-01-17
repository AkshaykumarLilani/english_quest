const asyncHandler = require("express-async-handler");
const { createBook, getPaginatedBooksList, getOwnBooks, getNonPaginatedBooks, getBookCountWithFilter, getBookById, deleteBookById } = require("../services/book.service");
const { USER_ROLES } = require("../config/enums");
const logger = require("../config/winston.logger");

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Save a new book
 *     description: Creates and saves a new book with the provided information.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Book information for saving
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: The author of the book
 *               title:
 *                 type: string
 *                 description: The title of the book
 *               publishedYear:
 *                 type: integer
 *                 description: The year the book was published
 *     responses:
 *       '200':
 *         description: Successfully saved a new book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book:
 *                   type: object
 *                   description: Information about the saved book
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The book ID
 *                     author:
 *                       type: string
 *                       description: The author of the book
 *                     title:
 *                       type: string
 *                       description: The title of the book
 *                     publishedYear:
 *                       type: integer
 *                       description: The year the book was published
 *                     creator:
 *                       type: string
 *                       description: The user ID of the creator
 *       '401':
 *         description: Unauthorized. User authentication failed.
 *       '500':
 *         description: Internal server error. Failed to save the book.
 */

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

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Edit a book
 *     description: Edits a book with the specified ID by updating author, title, or published year.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated book information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: The updated author of the book
 *               title:
 *                 type: string
 *                 description: The updated title of the book
 *               publishedYear:
 *                 type: integer
 *                 description: The updated published year of the book
 *     responses:
 *       '200':
 *         description: Successfully edited the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 potentialBook:
 *                   type: object
 *                   description: Information about the edited book
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The book ID
 *                     author:
 *                       type: string
 *                       description: The author of the book
 *                     title:
 *                       type: string
 *                       description: The title of the book
 *                     publishedYear:
 *                       type: integer
 *                       description: The year the book was published
 *                     creator:
 *                       type: string
 *                       description: The user ID of the creator
 *       '400':
 *         description: Bad request. The provided book ID is invalid or missing.
 *       '401':
 *         description: Unauthorized. User authentication failed.
 *       '500':
 *         description: Internal server error. Failed to edit the book.
 */
const editABook = asyncHandler(async (req, res) => {
    const params = req.params;
    const { id } = params;

    if (!id) {
        res.status(400);
        throw new Error("Id is required for the book to edit");
    }

    const potentialBook = await getBookById(id);

    if (!potentialBook){
        res.status(400);
        throw new Error("Book not found.");
    }

    
    const body = req.body;
    
    if (body.author) {
        potentialBook.author = body.author;
    }

    if (body.title) {
        potentialBook.title = body.title;
    }

    if (body.publishedYear) {
        potentialBook.publishedYear = body.publishedYear;
    }

    if (req.user._id !== potentialBook.creator){
        potentialBook.creator = req.user._id;
    }

    await potentialBook.save();

    logger.info({ potentialBook });

    return res.status(200).json({
        potentialBook
    })
});

/**
* @swagger
* /books:
*   get:
*     summary: Get a list of books
*     description: Retrieves a list of books based on user permissions and query parameters.
*     tags:
*       - Books
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: page
*         description: The page number for pagination (default is 1)
*         schema:
*           type: integer
*       - in: query
*         name: page_size
*         description: The number of items per page (default is 8), can be set using env PAGINATION_SIZE
*         schema:
*           type: integer
*       - in: query
*         name: new
*         description: Filter books created in the last 10 minutes (1) or not (0)
*         schema:
*           type: integer
*           enum: [0, 1]
*       - in: query
*         name: old
*         description: Filter books created 10 or more minutes ago (1) or not (0)
*         schema:
*           type: integer
*           enum: [0, 1]
*     responses:
*       '200':
*         description: Successfully retrieved a list of books
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 results:
*                   type: array
*                   description: List of books
*                   items:
*                     type: object
*                     properties:
*                       _id:
*                         type: string
*                         description: The book ID
*                       author:
*                         type: string
*                         description: The author of the book
*                       title:
*                         type: string
*                         description: The title of the book
*                       publishedYear:
*                         type: integer
*                         description: The year the book was published
*                       creator:
*                         type: string
*                         description: The user ID of the creator
*                 count:
*                   type: integer
*                   description: Total number of books matching the criteria
*       '401':
*         description: Unauthorized. User authentication failed.
*       '500':
*         description: Internal server error. Failed to retrieve the list of books.
*/

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
        let count = 0;
        if (Number(new_) === 1) {
            // show books that are created in the last 10 minutes
            const filter = { createdAt: { $gte: tenMinutesAgo, $lt: new Date() } };
            books = await getNonPaginatedBooks(filter);
            count = await getBookCountWithFilter(filter);
        } else if (Number(old_) === 1) {
            // show books that were created 10 or more minutes ago
            const filter = { createdAt: { $lt: tenMinutesAgo } };
            books = await getNonPaginatedBooks(filter);
            count = await getBookCountWithFilter(filter);
        } else {
            books = await getPaginatedBooksList(pageNo, pageSize);
            count = await getBookCountWithFilter();
        }
        return res.status(200).json({ results: books, count: count });
    } else if (hasViewerPermission) {
        const books = await getOwnBooks(req.user._id, pageNo, pageSize);
        const filter = { creator: req.user._id }
        const count = await getBookCountWithFilter(filter);
        return res.status(200).json({ results: books, count: count });
    } else {
        // this should never happen since canView middleware checks this condition
    }
});

/**
 * @swagger
 * /books/delete:
 *   delete:
 *     summary: Delete a book
 *     description: Deletes a book with the specified ID.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Book ID for deletion
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the book to delete
 *     responses:
 *       '204':
 *         description: Successfully deleted the book
 *       '400':
 *         description: Bad request. The provided book ID is invalid.
 *       '401':
 *         description: Unauthorized. User authentication failed.
 *       '500':
 *         description: Internal server error. Failed to delete the book.
 */
const deleteABook = asyncHandler(async (req, res) => {
    const query = req.query;

    const potentialBook = await getBookById(query.id);

    if (!potentialBook) {
        res.status(400);
        throw new Error("This id is invalid");
    }

    const deleteBook = await deleteBookById(query.id);
    logger.info({ deleteBook })

    return res.status(204).json();
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieves a book with the specified ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The book ID
 *                 author:
 *                   type: string
 *                   description: The author of the book
 *                 title:
 *                   type: string
 *                   description: The title of the book
 *                 publishedYear:
 *                   type: integer
 *                   description: The year the book was published
 *                 creator:
 *                   type: string
 *                   description: The user ID of the creator
 *       '400':
 *         description: Bad request. The provided book ID is invalid.
 *       '404':
 *         description: Not found. The book with the given ID does not exist.
 */

const getABook = asyncHandler(async (req, res) => {
    const params = req.params;

    const potentialBook = await getBookById(params.id);

    if (!potentialBook) {
        res.status(400);
        throw new Error("This id is invalid");
    }

    return res.status(200).json(potentialBook);
});

module.exports = {
    saveABook,
    getAllBooks,
    deleteABook,
    editABook,
    getABook
}