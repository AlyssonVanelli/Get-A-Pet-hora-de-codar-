const mongoose = require('mongoose');
const { schema } = mongoose

const Pet = mongoose.model(
    'Pet',
    new Schema({
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        wight: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        available: {
            type: Boolean,
        },
        user: Object,
        adopter: Object,
    },
        { timestamps: true }
    )
)

module.exports = Pet