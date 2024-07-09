import {ObjectId} from 'mongodb';
import { getDb } from '../database';

class Blog{
    _id:ObjectId;
    title:string;
    image:string;
    shortDescription:string;
    article:string;
    post:number;
    tags:string[];
    ownerId:string;
    constructor(title:string, image:string, shortDescription:string, article:string, tags:string[], ownerId:string, post:number, id:string){
        this.title = title;
        this.image = image;
        this.shortDescription=shortDescription;
        this.article = article;
        this.tags = tags;
        this.ownerId = ownerId;
        this.post = post;
        this._id = new ObjectId(id);
    }

    async save(){
        const db = getDb();
        const data = await db?.collection<Blog>('blogs').insertOne(this);
        if(data?.acknowledged){
            return {message:"Blog object was inserted successfuly", code:200};
        }
        else{
            return {message:"Object was not inserted", code:500};
        }
    }

    static async readAll() : Promise<Blog[] | null>{
        const db = getDb();
        const blogs:Blog[] | null = await db?.collection<Blog>('blogs').find().toArray() ?? null;
        if(blogs){
            return blogs;
        }
        else{
            return null;
        }
    }

    static async readOne(id:string) : Promise<Blog|null>{
        console.log( 'this', id);
        const db = getDb();
        const blog:Blog | null = await db?.collection<Blog>('blogs').findOne({_id:new ObjectId(id)}) ?? null;
        console.log('this',blog)
        if(blog){
            return blog;
        }
        else{
            return null;
        }
    }

    static async readSpecificPage(page:number){
        const db = getDb();
        const blogs:Blog[] | null = await db?.collection<Blog>('blogs').find().skip((page - 1) * 10).limit(10).toArray() ?? null;
        console.log(blogs);
        const count = await db?.collection<Blog>('blogs').countDocuments();
        const next = count as number > page * 10? (page + 1) : null;
        return {blogs, next};
        
    }

    static async updateBlog(id:string, blog:Blog){
        const db = getDb();
        const data = await db?.collection<Blog>('blogs').updateOne({_id: new ObjectId(id)}, {$set: blog});
        if(data?.acknowledged){
            return {message:'Blog update is successful', code:200};
        }
        else{
            return {message:'Blog update is not successful', code:500};
        }
    }

    static async deleteBlog(id:string){
        const db = getDb();
        const data = await db?.collection<Blog>('blog').deleteOne({_id: new ObjectId(id)});
        if(data?.acknowledged){
            return {message:'Blog deletion was successful', code:200};
        }
        else{
            return {message:'Blog deletion was not successful', code:500};
        }
    }

    static async readFilteredData(property:string, value:string){
        const db = getDb();
        const query = {[property] : value};
        const data: Blog[] | null = await db?.collection<Blog>('blogs').find(query).toArray() ?? null;
        if(data){
            return data;
        }
        else{
            return null;
        }
    }
}

export default Blog;