import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./utils/db.js";

// import all routes
import userRoutes from "./routes/user.routes.js";
import bookRoutes from "./routes/books.routes.js";
import orderRoutes from "./routes/order.route.js";
import paymentRoutes from "./routes/payment.routes.js";


dotenv.config();
const app = express();

app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type','Authorization']
    })
);

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Hello from the backend")
})

app.get("/mohit",(req,res)=>{
    res.send("Hello Mohit!");
});

app.get("/rohit",(req,res)=>{ 
    res.send("Hello Rohit!");
});


// Connect to db
db();

//user routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})