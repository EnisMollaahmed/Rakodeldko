import { ObjectId } from 'mongodb';
import { getDb } from '../database';

class Product{
    _id:ObjectId;
    name:string;
    image:string;
    description:string;
    tags:string[];
    price:number;
    userId:string;
    constructor(name:string, image:string, description:string, tags:string[], price:number, userId:string, id:string){
        this.name = name;
        this.image = image;
        this.description = description;
        this.tags = tags;
        this.price = price;
        this.userId = userId;
        this._id = new ObjectId(id);
    }

    async save(){
        const db = getDb();
        await db?.collection('products').insertOne(this);
    }

    // async update(){
    //     const db = getDb();
    //     console.log('this',this);
    //     await db?.collection<Product>('products').updateOne({_id: this._id},{$set:this});
    // }
    static async updateProduct(product:Product){
        const db = getDb();
        console.log('this',product);
        await db?.collection<Product>('products').updateOne({_id: product._id},{$set:product});
    }

    static async getProductById(id:string){
        const db = getDb();
        const product:Product|null = await db?.collection('products').findOne({_id: new ObjectId(id)}) as Product|null;
        return product;
    }

    static async deleteProduct(id:string){
        const db = getDb();
        const data =  await db?.collection('products').deleteOne();
        if(data?.deletedCount === 1){
            return 200;
        }
        else{
            return 500;
        }
    }

    static async readFilteredData(property:string, value:string){
        const db = getDb();
        console.log('here',property);
        console.log(value);
        const query = {[property] : value};
        const data: Product[] | null = await db?.collection<Product>('products').find(query).toArray() ?? null;
        console.log(data);
        if(data){
            return data;
        }
        else{
            return null;
        }
    }
}

export default Product;