const express = require('express');
const app = express();
const config=require('./config/config');
const cookieParser= require('cookie-parser');
require('dotenv').config();

//All Middlewares and packages that are required for this application .................................................
app.use(config.cors(config.corsOptions));
app.use(express.json());
app.use(cookieParser());
const server = config.http.createServer(app);

//Initialize socket connection.........................................................................................
config.initializeSocket(server);

// Express Routes ......................................................................................................
//Authentication Router that handles authentication requests of Register and Login and Logout routes.........
app.use('/api/v1/auth',config.authRouter);

//User Router that handles user requests of Get, Create, Update, Delete and Search routes...............
app.use('/api/v1/user',config.userRouter);
//Error Handling Middleware ............................................................................................
app.use(config.errorMiddleware);

// Start the server....................................................................................................
server.listen(process.env.PORT, async() => {
    await config.connectMongoDB();
    console.log('Connected to MongoDB');  
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});