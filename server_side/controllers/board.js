/**
 * Contains controllers related to board management
 */

const User = require("../models/user");
const Board = require("../models/board");
const List = require("../models/list");
const Card = require("../models/card");
const Comment = require("../models/comment");
const ActivityLog = require("../models/activityLog");
const Member = require("../models/member");

exports.createBoard = async (req, res) => {
    // Creates a new board
    try {
        const current_user = req.current_user;
        const {title, description} = req.body;

        if (!title || !description) {
            return res.status(400).json({Error: "Title or description missing"});
        }
        // Create the board
        const board = new Board({
            title: title,
            description: description,
            owner: current_user._id,
            members: current_user._id
        });
        await board.save();

        // Create the board member data for this user
        const member = new Member({
            board: board._id,
            role: "admin",
            user: current_user._id
        });
        await member.save();

        // Populate the activity log
        const logger = new ActivityLog({
            action: "create",
            entity: "board",
            entityId: board._id,
            details: `${current_user.username} created this board`,
            createdBy: current_user._id,
            boardId: board._id,
        });
        await logger.save();

        // Retrive the created group and populate the members field
        const boardData = await Board.findById(board._id)
        .populate("members");

        //console.log(boardData);

        // Return a response to the client
        return res.status(201).json(boardData);

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occurred: ${err.message}`});
    }
}

exports.getBoards = async (req, res) => {
    // Retrieves all boards for the current user
    try {
        const current_user = req.current_user;
        
        const boards = await Board.find({
            $or: [
                {owner: current_user._id},
                {members: {$in: [current_user._id]}}
            ]
        }).sort({ updatedAt: -1 }).populate("members");

        return res.status(200).json(boards);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}

exports.getBoardById = async (req, res) => {
    // Retrieves a single board data based on the id
    const boardId = req.params.boardId;
    const current_user = req.current_user;

    try {
        const board = await Board.findById(boardId).populate({
            path: "lists",
            populate: {
                path: "cards"
            }
        }).exec();

        // Check if board exists
        if (!board) {
            return res.status(404).json({});
        }

        // Check if the current user is authorized to see this board
        if (!board.members.includes(current_user._id)) {
            return res.status(403).json({
                error: "You're not a member of this board"
            });
        }

        // Return a response back to the client
        return res.status(200).json(board);

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}

exports.updateBoard = async (req, res) => {
    // Updates a board data
    try {
        const id = req.params.id;
        const data = req.body;
        const current_user = req.current_user;
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({error: "Board not found"});
        }
        // set up log details
        const logDetails = [];
        // update the board manually and implement logging
        Object.keys(data).forEach(key => {
            if (board[key] !== data[key]) {
                console.log("Constructing the activity log details");
                const msg = `${current_user.username} changed board ${key} from ${board[key]} to ${data[key]}`
                logDetails.push(msg);
                board[key] = data[key]
            }
        });
        if (logDetails.length > 0) {
            const logger = new ActivityLog({
                action: "update",
                entity: "Board",
                entityId: board._id,
                details: logDetails.join("; "),
                boardId: board._id,
                createdBy: current_user._id
            });
            await logger.save();
            console.log("update board Log activity successfully saved");
        }
        board.updatedAt = Date.now();
        await board.save();
        // return a response to  the client
        return res.status(200).json(board);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}

exports.addMember = async (req, res) => {
    // Adds a member to the board.members field
    const boardId = req.params.boardId;
    const current_user = req.current_user;
    const { username } = req.body;

    try {
        const board = await Board.findById(boardId);

        if (!board) {
            console.log(`Board <${board.title}> not found`);
            return res.status(404).json({message: "Board not found"});
        }

        const user = await User.findOne({username: username});

        if (user && board.members.includes(user._id)) {
            console.log("Member already exists in the board");
            return res.status(409).json({
                message: "User already exists in the board"
            });
        }

        // Create the new board members document for that user
        const member = new Member({
            board: board._id,
            role: "member",
            user: user._id
        });
        await member.save();

        // add member to the board
        board.members.push(user._id);
        await board.save();

        // log the activity
        const logger = new ActivityLog({
            action: "Add member",
            entity: "Board",
            entityId: boardId,
            details: `${current_user.username} added ${username} to this board`,
            createdBy: current_user._id,
            boardId: boardId,
        });

        await logger.save();

        // return a response to the client
        return res.status(200).json(member);

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`
        });
    }
}

exports.deleteBoard = async (req, res) => {
    console.log('Starting deleteBoard function');
    try {
        const boardId = req.params.boardId;
        //console.log(`Attempting to delete board with ID: ${boardId}`);
        
        // Find the board by id
        const board = await Board.findById(boardId);
        if (!board) {
            //console.log(`Board with ID ${boardId} not found`);
            return res.status(404).json({message: "Board not found"});
        }
        //console.log(`Board found: ${board._id}`);

        // Delete the lists and cards for that board
        const listIds = board.lists;
        //console.log(`Found ${listIds.length} lists to delete`);

        for (const listId of listIds) {
            //console.log(`Processing list: ${listId}`);
            const list = await List.findById(listId);
            if (list) {
                const cardIds = list.cards;
                //console.log(`Found ${cardIds.length} cards in list ${listId}`);

                for (const cardId of cardIds) {
                    //console.log(`Deleting comments for card: ${cardId}`);
                    const commentDeleteResult = await Comment.deleteMany({card: cardId});
                    //console.log(`Deleted ${commentDeleteResult.deletedCount} comments for card ${cardId}`);

                    //console.log(`Deleting card: ${cardId}`);
                    const cardDeleteResult = await Card.findByIdAndDelete(cardId);
                    //console.log(`Card delete result: ${cardDeleteResult ? 'Success' : 'Failed'}`);
                }
            }
            
            //console.log(`Deleting list: ${listId}`);
            const listDeleteResult = await List.findByIdAndDelete(listId);
            //console.log(`List delete result: ${listDeleteResult ? 'Success' : 'Failed'}`);
        }

        // Finally delete the board itself
        //console.log(`Deleting board: ${boardId}`);
        const boardDeleteResult = await Board.findByIdAndDelete(boardId);
        //console.log(`Board delete result: ${boardDeleteResult ? 'Success' : 'Failed'}`);

        //console.log('Board deletion process completed successfully');
        return res.status(200).json({message: "Board deleted successfully"});
    } catch (err) {
        console.error(`Error in deleteBoard function: ${err.message}`);
        console.error(`Error stack: ${err.stack}`);
        res.status(500).json({
            error: `An internal error occurred: ${err.message}`
        });
    }
}
