import mongoConnect from "./database";
import express from 'express';
import { productRouter } from "./routes/product";
import { usersRouter } from "./routes/users";
import { ordersRouter } from "./routes/orders";
import { blogsRouter } from "./routes/blogs";
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

const port = 8080;

app.use('/products', productRouter);

app.use('/users', usersRouter);

app.use('/orders', ordersRouter);

app.use('/blogs', blogsRouter);

mongoConnect(()=>{
    app.listen(port);
});