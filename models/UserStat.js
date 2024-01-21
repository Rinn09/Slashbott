const mongoose = require('mongoose');

const userStatSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    userLevels: { type: Number, default: 0 },
    userExp: { type: Number, default: 0 },
    userCash: { type: Number, default: 0 },
});

const UserStat = mongoose.model('UserStat', userStatSchema);

module.exports = UserStat;
