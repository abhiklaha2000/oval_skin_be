const express =  require('express');
const { Questioniar } = require('../controllers/Questioniar.Controller');
const questioniar_router = new express.Router();

questioniar_router.post('/oval_skin/questioniar', Questioniar.insertQuestioniarData);
questioniar_router.post('/oval_skin', Questioniar.insertIPAddress);

module.exports = questioniar_router;

