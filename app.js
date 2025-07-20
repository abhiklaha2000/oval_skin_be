const express = require('express');
const cors = require("cors");
const questioniar_router = require('./routes/Questioniar.Router');
require('./db_config/conn');


const app = express();
const port = process.env.Port || 4000;
// const voteRouter =  require("./routes/vote");
// const nomineeRouter =  require("./routes/nominee");
// const adminRouter = require("./routes/admin")

// Allow all origins (for development)
app.use(cors());
app.use(express.json()); // <-- Enable JSON body parsing

// Test route
app.get("/api/v1/test", (req, res) => {
    res.json({ message: "CORS is working!" });
});

app.use('/api/v1', questioniar_router);


// // for Vote Routes
// app.use('/api/v1',voteRouter);
// // for nominee routes
// app.use('/api/v1',nomineeRouter);
// // for admin routes
// app.use('/api/v1',adminRouter);

app.listen(port,() =>{
    console.log(`listening on ${port}`);
})