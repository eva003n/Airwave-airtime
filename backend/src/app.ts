import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN_URLS, NODE_ENV } from "./config/env.js";
import helmet from "helmet";
import morganMiddleware from "./logger/morgan.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";

const app = express();

/*Global middleware */


//configure cross origin resource sharing
app.use(
  cors({
    origin: CORS_ORIGIN_URLS?.split(",") || "https://www.evandev.codes",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    optionsSuccessStatus: 200,
  })
);
console.log(CORS_ORIGIN_URLS)
//configure content security policy
app.use(helmet());
//parse http header cookies into req.cookies object
app.use(cookieParser());
//parses the payload into json format
app.use(
  express.json({
    limit: "16kb",
  })
);
//parse urlencoded request body with complex data structure
app.use(express.urlencoded({ extended: true }));
//serve static files
app.use(express.static("public"));
//logging http requests
app.use(morganMiddleware);


/*---Custom middleware--- */
import setEnvironment from "./middlewares/env.middleware.js";
import interceptRequest from "./middlewares/connect.middleware.js";

app.use(setEnvironment)

app.use(interceptRequest)

//API endpoints
import homeRouter from "./routes/home.routes.js";
import authRouter from "./routes/auth.routes.js";
import recipientRouter from "./routes/recipient.routes.js";
import topUpRouter from "./routes/topup.routes.js";
import userRouter from "./routes/user.routes.js";
import walletRouter from "./routes/wallet.routes.js";
import transactionRouter from "./routes/transaction.routes.js"
import ledgerRouter from "./routes/ledger.routes.js"
import reportRouter from "./routes/report.routes.js";
import paymentRouter from "./routes/payment.routes.js"
import notFoundRouter from "./routes/not-found.routes.js";
import healthCheckRouter from "./routes/health.routes.js";
import { serverAdapter } from "./config/Bullmq/bullboard.js";



app.use("/api/v1", homeRouter)
/*--Authentication--*/
app.use("/api/v1/auth", authRouter);
/*--Airtime recipients management-- */
app.use("/api/v1/recipients", recipientRouter);
/*--Airtime distribution management-- */
app.use("/api/v1/top-ups", topUpRouter);
/*-- User management -- */
app.use("/api/v1/users", userRouter);
/*-- Wallet management -- */
app.use("/api/v1/wallets", walletRouter);
/*-- Transaction management -- */
app.use("/api/v1/transactions", transactionRouter);
/*-- Ledger management -- */
app.use("/api/v1/ledgers", ledgerRouter);
/* -- Reports and analytics -- */
app.use("/api/v1/reports", reportRouter);
/* -- Payments -- */
app.use("/api/v1/payments", paymentRouter)
/*-- API monotoring -- */
app.use("/api/v1/health-check", healthCheckRouter);


/*--- Admin --- */
if(NODE_ENV === "development") {
  app.use("/admin/queues", serverAdapter.getRouter());
}

//hanfle 404 Not Found endpoints
app.use(notFoundRouter);
//this error handling middleware comes last after all middleware to fully capture errors
app.use(errorHandlerMiddleware);

export { app };
