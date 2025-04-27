const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewiewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing' // ✅ Capitalized and matches the model name
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
    
})


module.exports = mongoose.model('Review',rewiewSchema);

