const express = require("express");
require("dotenv").config({});
const cookieParser=require("cookie-parser")
const connectToDataBase = require("./utils/db");
const port = process.env.PORT;
const uri = process.env.DBURI;
const jwt = require("jsonwebtoken")

//routes
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

const app = express();

// data parsing middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "application/json" }));
app.use(cookieParser())
// routers
app.use("/users", userRouter);
app.use("/auth", authRouter);

connectToDataBase(uri, () => {
	app.listen(port, () => {
		console.log(`app is listening on port ${port}`);
	});
});
