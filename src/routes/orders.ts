import express from 'express';
import Order from '../models/Orders';

const router = express.Router();

const extractObjInNeededForm = (order: Order) => {
    return {id: order._id.toString(), clientId:order.clientId, craftsmanId: order.craftsmanId, productName: order.productName, quantity: order.quantity, paymentMethod: order.paymentMethod, status:order.status, address: order.address}
}

router.get('/all', async (req,res)=>{
    const orders:Order[] | null = await Order.readAll();
    if(orders){
        res.statusCode = 200;
        res.statusMessage = 'Orders are found';
        const toReturn = orders.filter((order:Order) => extractObjInNeededForm(order));
        res.send(toReturn);
    }
    else{
        res.statusCode = 404;
        res.statusMessage = 'Cannot find orders';
        res.send([]);
    }
});

router.get('/page/:page', async (req, res) => {
    const page:number = Number(req.params.page);
    const {orders, next}:{orders:Order[] | null, next: number | null} = await Order.readSpecificPage(page);
    if(orders){
        res.statusCode = 200
        res.statusMessage = 'Orders are found successfuly';
        const returned = orders.filter((order:Order)=>extractObjInNeededForm(order));
        res.send({returned, next});
    }
    else{
        res.statusMessage = 'Cannot find the orders';
        res.statusCode = 404;
        res.send({returned:[], next:null});
    }
});

router.get('/filter/:property-:value', async (req, res) => {
    const orders:Order[] | null = await Order.readFilteredData(req.params.property, req.params.value);
    res.status(orders? 200 : 404).json(orders ? orders.map((order:Order) => extractObjInNeededForm(order)) : null);
});

router.get('/:id', async (req, res) => {
    const id:string = req.params.id;
    const order:Order | null = await Order.readOne(id);
    if(order){
        res.statusCode = 200
        res.statusMessage = 'Order is found successfuly';
        res.json(extractObjInNeededForm(order));
    }
    else {
        res.statusMessage = 'Cannot find the order';
        res.statusCode = 404;
        res.json([]);
    }
});

router.post('/add', async (req, res) => {
    const body = req.body;
    const order = new Order(body.clientId, body.craftsmanId, body.productName, body.quantity, body.price, body.address, body.paymentMethod, body.id);
    const {message, code} = await order.save();
    res.status(code).json({message:message});
});

router.put('/:id', async (req, res)=>{
    const id = req.params.id;
    const body = req.body;
    const order:Order = new Order(body.clientId,body.craftsmanId, body.productName, body.quantity, body.price, body.address, body.paymentMethod, id);
    const {message, code} = await Order.updateOrder(id, order);
    res.status(code).json({message:message});
});

router.delete('/delete/:id', async (req, res)=>{
    const id = req.params.id;
    const {message, code} = await Order.deletedOrder(id);
    res.send(code).json({message:message});
});

export {router as ordersRouter};