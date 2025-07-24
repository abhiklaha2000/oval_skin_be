const mongoose = require('mongoose');

const QuestioniarSchema = new mongoose.Schema({
    unique_id: {
        type: Number,
        required: true,
    },
    device_type:{
        type: String,
        required: true,
    },
    browser:{
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    timezone: {
        type: String,
        required: true,
    },
    ip_address: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        default: "",
        trim: true
    },
    answer_1:  { type: Object, default: {} },
    answer_2: { type: Object, default: {} },
    answer_3: { type: Object, default: {} },
    answer_4: { type: Object, default: {} },
    answer_5: { type: Object, default: {} },
    answer_6: { type: Object, default: {} },
    answer_7: { type: Object, default: {} },
    answer_8: { type: Object, default: {} },
    answer_9: { type: Object, default: {} },
    answer_10: { type: Object, default: {} },
    answer_11: { type: Object, default: {} },
    answer_12: { type: Object, default: {} },
    answer_13: { type: Object, default: {} },
    answer_14: { type: Object, default: {} },
    answer_15: { type: Object, default: {} },
    answer_16: { type: Object, default: {} },
    result_type: {
        type: String,
        default: ""
    },
    is_quiz_completed:{
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: false,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active' // optional, if you want a default value
    },
    avg_time_per_qst:{
        type: Number,
        default: 0
    },
    avg_total_time_per_completion:{
        type: Number,
        default: 0
    },
    is_share: {
        type: Boolean,
        default: false
    },
    total_share: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    minimize: false // <--- This forces Mongoose to save empty objects too

});


// Create the FormResponse model
const Questioniar = mongoose.model('Questioniar', QuestioniarSchema);

module.exports = Questioniar;