const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
    is_quiz_completed:{
        type: Boolean,
        default: false
    },
    avg_time_per_qst:{
        type: String,
        default: ""
    },
    avg_total_time_per_completion:{
        type: String,
        default: ""
    },
    is_share: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    minimize: false // <--- This forces Mongoose to save empty objects too

});


// Create the FormResponse model
const Dashboard = mongoose.model('Dashboard', DashboardSchema);

module.exports = Dashboard;