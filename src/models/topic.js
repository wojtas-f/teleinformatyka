
const mongoose = require('mongoose')

const User = require('./user')


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

topicSchema.virtual('topic',{
    ref: 'User',
    localField: '_id',
    foreignField: 'reservedTopic'
})

topicSchema.statics.prepareFullList = async (stud) => {
    const list = await Topic.find({})
    await list.forEach(async element=>{
            element.stud = stud
            const {name} = await User.findOne({_id: element.owner})
            element.ownerName = name
            
        })
    return list
}

topicSchema.statics.prepareParamsList = async (stud,authorID) => {
    const list = await Topic.find({ owner: authorID })
    if(stud){
        await list.forEach(async element=>{
            element.stud = stud
            const {name} = await User.findOne({_id: element.owner})
            element.ownerName = name
        })
    }
    
    return list
}

const Topic = mongoose.model('Topic', topicSchema)
module.exports = Topic
