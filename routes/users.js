const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
    const userList = await User.find();

    if (!userList) {
        res.status(500).json({success: false});
    }
    res.send(userList);
});

module.exports = router;