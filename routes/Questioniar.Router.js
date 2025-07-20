const express =  require('express');
const { Questioniar } = require('../controllers/Questioniar.Controller');
const questioniar_router = new express.Router();


questioniar_router.get('/oval_skin/:unique_id', Questioniar.getQuestioniarData);
questioniar_router.post('/oval_skin/questioniar/:unique_id', Questioniar.insertQuestioniarData);
questioniar_router.post('/oval_skin', Questioniar.insertIPAddress);

module.exports = questioniar_router;

