const router = require("express").Router();
const { findByIdAndUpdate, findById, findByIdAndDelete, find, aggregate } = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../utils/verifyToken");



//UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedUser = await findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(updatedUser);
    }catch (err){
        res.status(500).json(err);
    }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      const user = await findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
});


//DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await findByIdAndDelete(req.params.id);
        res.status(200).json(`User has been deleted.`);
    } catch (err) {
        res.status(500).json(err);
    }
});


//GET ALL USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await find().sort({ _id: -1}).limit(5): await find();
        res.status(200).json(users);
    }catch (err){
        res.status(500).json(err);
    }
});


//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {$project : {
                month: {$month: "$createdAt"},
            }},
            {$group: {
                _id: "$month",
                total: { $sum: 1},
            }}
        ])
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;