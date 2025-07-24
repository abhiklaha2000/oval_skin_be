const express =  require('express');
const { Questioniar } = require('../controllers/Questioniar.Controller');
const questioniar_router = new express.Router();


questioniar_router.get('/oval_skin/dashboard', Questioniar.getDataForDashboard);
questioniar_router.get('/oval_skin/:unique_id', Questioniar.getQuestioniarData);
questioniar_router.get('/oval_skin', Questioniar.getAllQuestioniarData);
questioniar_router.post('/oval_skin/questioniar/:unique_id', Questioniar.insertQuestioniarData);
questioniar_router.post('/oval_skin', Questioniar.insertIPAddress);
questioniar_router.patch('/oval_skin/update_single_feild/:unique_id', Questioniar.updateSingleFeild);

module.exports = questioniar_router;

