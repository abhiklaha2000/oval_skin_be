const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
    completion_rate:{
        type: Number,
        default: false
    },
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
    skin_type_percentage: {
        type: Object,
        default: {}
    },
}, {
    timestamps: true,
    minimize: false // <--- This forces Mongoose to save empty objects too

});


// Create the FormResponse model
const Dashboard = mongoose.model('Dashboard', DashboardSchema);

module.exports = Dashboard;