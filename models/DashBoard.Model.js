const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
    user_quiz_completed: {
        type: Number,
        default: 0
    },
    // completion_rate:{
    //     type: Number,
    //     default: 0
    // },
    total_user_count:{
        type: Number,
        default: 0
    },
    avg_time_per_qst:{
        type: Number,
        default: 0
    },
    avg_total_time_per_completion: {
        type: Number,
        default: 0
    },
    is_share: {
        type: Number,
        default: 0
    },
    quiz_restart_rate: {
        type: Number,
        default: 0
    },
    FLARE: {
        type: Number,
        default: 0
    },
    BLOOM: {
        type: Number,
        default: 0
    },
    HAZE: {
        type: Number,
        default: 0
    },
    CALM: {
        type: Number,
        default: 0
    },
    FORGE: {
        type: Number,
        default: 0
    },
    GLOW: {
        type: Number,
        default: 0
    },
    MUSE: {
        type: Number,
        default: 0
    },
    DUSK: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    minimize: false // <--- This forces Mongoose to save empty objects too

});


// Create the FormResponse model
const Dashboard = mongoose.model('Dashboard', DashboardSchema);

module.exports = Dashboard;