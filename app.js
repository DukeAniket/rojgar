require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const chatIO = require("./io");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
//to read:
//https://www.npmjs.com/package/express-rate-limit

// middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticationMiddleware = require("./middleware/authentication");

//as early as possible
app.set("trust proxy", 1); //Troubleshooting Proxy Issues (making the rate limiter effectively a global one and blocking all requests once the limit is reached)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: false,
    legacyHeaders: false,
  })
);
app.use(helmet());
app.use(cors());
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true })); //invoke
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(express.json()); // all this req and we couldn't access it
app.use(xss());
app.use(cookieParser(process.env.JWT_SECRET));
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("alist api v1");
});

// routes start
const authRouter = require("./routes/auth");
const userInfoRouter = require("./routes/userInfo");
app.use("/api/v1/auth", authRouter);
// i want to protect all anime routes with authentication middleware
app.use("/api/v1/userinfo", authenticationMiddleware, userInfoRouter);
//routes end

//error 50% of this project is error
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const server = app.listen(port, () =>
      console.log(`Server is on port ${port}...`)
    );
    await chatIO(server);
  } catch (error) {
    console.log(error);
  }
};

start();
