/**
 * Moduł opisujący schemat tematów prac dyplomowych
 * @module TopicModel
 */

const mongoose = require('mongoose')

/**
 * Schemat mongoose opisujacy temat pracy dyplomowej odwzorowany na kolekcję MongoDB.
 * Więcej o schematach w mongoose {@link https://mongoosejs.com/docs/guide.html}
 * @constructor topicSchema
 * @property {String} title - Tytuł pracy dyplomowej
 * @property {String} description - Opis pracy dyplomowej
 * @property {String} level - Stopień naukowy (domyślnie inżynier)
 * @property {Boolean} reservationStatus - Stopień rezerwacji ( true - wolne, false - zajęte)
 * @property {String} author - Autor tematu i przypisany promotor
 * @property {Date} date - Data utworzenia tematu pracy dyplomowej
 *
 */

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
