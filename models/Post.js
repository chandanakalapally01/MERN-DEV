const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true,
    },
    name: {
        type: String
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ],
    comment: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            text: {
                type: String,
                requied: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date:{ 
        type: Date,
        default: Date.now
    }
})

module.exports = new mongoose.model('post', PostSchema)