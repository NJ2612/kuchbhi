const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permission = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('permission', permission);
