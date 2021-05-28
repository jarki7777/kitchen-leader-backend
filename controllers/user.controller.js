import Inventory from '../models/inventory.model.js';
import ShoppingList from '../models/shoppinglist.model.js';
import Favorite from '../models/favorite.model.js'
import FoodLog from '../models/foodLog.model.js';
import Comments from '../models/comment.model.js';
import User from '../models/user.model.js';

export const userController = {
    index: async (req, res) => {
        try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const userList = await User.paginate({}, { page: page, limit: limit });
            res.status(200).send({ userList });
        } catch (e) {
            res.status(400).send({ 'Error': e.message });
        }
    },
    show: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await User.findById({ _id: id });
            res.status(200).send({ user });
        } catch (e) {
            res.status(400).send({ 'Error': e.message });
        }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;

            const payload = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
                caloriesGoal: req.body.caloriesGoal,
                inventory: req.body.inventory,
                shoppingList: req.body.shoppingList,
                favorites: req.body.favorites
            }

            // Updates multiple fields, only update the fields for which query parameter isn't undefined
            Object.keys(payload).forEach(key => payload[key] === undefined ? delete payload[key] : {});

            await User.findByIdAndUpdate({ _id: id }, { $set: payload });
            res.sendStatus(202);
        } catch (e) {
            res.status(400).send({ 'Error': e.message });
        }
    },
    delete: async (req, res) => {
        try {
            // Delete all documents which contain the user ObjectId
            const id = req.params.id;
            await Inventory.findOneAndDelete({ user: id });
            await ShoppingList.findOneAndDelete({ user: id });
            await Favorite.findOneAndDelete({ user: id });
            await FoodLog.findOneAndDelete({ user: id });
            await Comments.findOneAndDelete({ user: id });
            await User.findByIdAndDelete({ _id: id });
            res.sendStatus(204);
        } catch (e) {
            res.status(400).send({ 'Error': e.message });
        }
    }
}