
const mongoose = require('mongoose')



const topicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 200
        },
        description: {
            type: String,
            required: true,
            minlength: 20,
            maxlength: 1500
        },
        level: {
            type: String,
            default: 'inżynier'
        },
        reservationStatus: {
            type: Boolean,
            default: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            
        }
    },
    { timestamps: true }
)

const Topic = mongoose.model('Topic', topicSchema)
module.exports = Topic
