const mongoose = require('mongoose');

const QuestioniarSchema = new mongoose.Schema({
    unique_id: {
        type: Number,
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
    answer_1: { type: String, default: "" },
    answer_2: { type: String, default: "" },
    answer_3: { type: String, default: "" },
    answer_4: { type: String, default: "" },
    answer_5: { type: String, default: "" },
    answer_6: { type: String, default: "" },
    answer_7: { type: String, default: "" },
    answer_8: { type: String, default: "" },
    answer_9: { type: String, default: "" },
    answer_10: { type: String, default: "" },
    answer_11: { type: String, default: "" },
    answer_12: { type: String, default: "" },
    answer_13: { type: String, default: "" },
    answer_14: { type: String, default: "" },
    answer_15: { type: String, default: "" },
    answer_16: { type: String, default: "" },
    skin_type_value: {
        type: Map,
        of: Number,
        default: {}
    },
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
    }
}, {
    timestamps: true
});


// Create the FormResponse model
const Questioniar = mongoose.model('Questioniar', QuestioniarSchema);

module.exports = Questioniar;