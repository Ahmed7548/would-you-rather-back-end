const express = require("express");
require("dotenv").config({});
const connectToDataBase= require("./utils/db");
const port = process.env.PORT;
const uri = process.env.DBURI;

//routes
const userRouter=require("./routes/user")

const app = express();


// data parsing middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "application/json" }));
// routers
app.use("/users",userRouter)


connectToDataBase(uri, () => {
	app.listen(port, () => {
		console.log(`app is listening on port ${port}`);
	});
});
