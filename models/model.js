const mongoose = require('mongoose');

//schemas
const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        unique: true,
    },
    visitHistory: [{
        timestamp: { type: Number}
    }]
},
{timestamps: true}
);

const URL = mongoose.model('url', urlSchema);

module.exports = URL;