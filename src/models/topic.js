/**
 * Moduł opisujący schemat tematów prac dyplomowych
 * @module TopicModel
 */

const mongoose = require('mongoose')
const valdiator = require('validator')

/**
 * Schemat opisujacy temat pracy dyplomowej
 * @constructor topicSchema
 * @property {String} title - Tytuł pracy dyplomowej
 * @property {String} description - Opis pracy dyplomowej
 * @property {String} level - Stopień naukowy (domyślnie inżynier)
 * @property {Boolean} reservationStatus - Stopień rezerwacji ( true - wolne, false - zajęte)
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
    }
})

const Topic = mongoose.model('Topic', topicSchema)
module.exports = Topic
