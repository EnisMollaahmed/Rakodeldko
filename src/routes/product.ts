import express from 'express';
import { getDb } from '../database';
import { Db, ObjectId } from 'mongodb';
import Product from '../models/Product';

const router = express.Router();

const extractProduct = (product:Product) => {return {id: product._id.toString(), name: product.name, image:product.image, description: product.description, tags: product.tags, price: product.price, userId: product.userId}};

router.get('/all', async (req, res)=>{
    console.log('here')
    const db:Db = getDb() as Db;
    const products:Product[] | null = await db.collection<Product>('products').find().toArray() ?? null;
    const toReturn = products.map((product:Product) => {return {id: product._id.toString(), name: product.name, image:product.image, description: product.description, tags: product.tags, price: product.price, userId: product.userId}})
    res.status(200).json(toReturn);
})

router.get('/filter/:property-:value', async (req, res) => {
    console.log('here1',req.params.property);
    console.log('here2', req.params.value)
    const products:Product[] | null = await Product.readFilteredData(req.params.property, req.params.value);
    console.log('filtered products',products)
    res.status(products? 200 : 404).json(products? products.map((product:Product)=>extractProduct(product)): []);
});

router.get('/:id', async (req, res)=>{
    console.log(req.params.id);
    const db:Db = getDb() as Db;
    const product: Product | null = await db.collection<Product>('products').findOne({_id:new ObjectId(req.params.id)}) ?? null;
    console.log(product)
    res.status(200).json({id: product?._id.toString(), name:product?.name, image: product?.image, description: product?.description, tags: product?.tags, price: product?.price, userId: product?.userId});
});

router.get('/page/:page', async (req, res)=>{
    const db:Db = getDb() as Db;
    const page:number = Number(req.params.page);
    const pages:number = 10 * (page - 1);
    const products:Product[] = await db.collection<Product>('products').find().skip(pages).limit(10).toArray() ?? null;
    const count = await db.collection<Product>('products').countDocuments({});
    const next=  count > (page * 10) ? (page + 1) : null 
    const toReturn = products.map((product:Product) => { return {id: product._id.toString(), name: product.name, image:product.image, description: product.description, tags: product.tags, price: product.price, userId: product.userId}});
    res.status(200).json({toReturn, next});
});

router.post('/add', async (req, res) => {
    const body = req.body;
    const product:Product = new Product(body.name, body.image, body.description, body.tags, body.price, body.userId, body.id);
    await product.save();
})

const synchronyzeObject = (prod:Product,product:any) => {
    prod.name = product.name;
    prod.description = product.description;
    prod.image = product.image;
    prod.price = product.price;
    prod.tags = product.tags;
} 

router.put('/:id', async (req, res)=>{
    const id:string = req.params.id;
    const product = req.body;
    console.log('product.ts req.body', product);
    const prod:Product | null = await Product.getProductById(id);
    console.log('product.ts prod',prod);
    if (prod) {
        synchronyzeObject(prod, product);
        console.log('synchronized prod', prod);
        await Product.updateProduct(prod);
        res.status(200).json({message:'Product is successfully updated'});
    } else {
        res.status(404).json({message:'Product not found'});
    }
});

router.delete('/delete/:id', async (req, res)=>{
    const id = req.params.id;
    const code:number = await Product.deleteProduct(id);
    if(code === 200){
        res.status(code).json({message:'Deleted successfuly'});
    }
    else{
        res.status(code).json({message:'Error while deleting'});
    }
});

export {router as productRouter};