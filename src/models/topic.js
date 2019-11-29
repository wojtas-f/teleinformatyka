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

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 1000
    },
    level: {
        type: String,
        default: 'inżynier'
    },
    reservationStatus: {
        type: Boolean,
        default: true
    },
    author: {
        type: String,
        default: 'Filip Wojtaś'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Topic = mongoose.model('Topic', topicSchema)
module.exports = Topic
