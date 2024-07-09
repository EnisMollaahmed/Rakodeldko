import { ObjectId } from 'mongodb'
import { getDb } from "../database";

export class User{
    _id:ObjectId;
    name:string;
    username:string;
    email:string;
    password:string;
    role:string;
    constructor(name:string, username:string, email:string, password:string, role:string, id:string){
        console.log('do tuk dobre')
        this.name = name;
        console.log('dobre1')
        this.username = username;
        console.log('dobre2')
        this.email = email;
        console.log('dobre3')
        this.password = password;
        console.log('dobre4')
        this.role = role;
        console.log('dobre5');
        console.log(id);
        this._id = new ObjectId(id as string);
        console.log('here is ok');
    }
    async save(){
        console.log('in save', this);
        const db = getDb();
        console.log('in save',this)
        await db?.collection('users').insertOne(this);
    }

    static async readAll():Promise<User[]>{
        const db = getDb();
        const users:User[] = await db?.collection('users').find().toArray() as User[];
        return users;
    }

    static async readSpecificUser(id:string):Promise<User|null>{
        const db = getDb();
        const user:User|null = await db?.collection<User>('users').findOne({_id:new ObjectId(id)}) ?? null;
        if(user){
            return user;
        }
        else{
            return null;
        }
    }

    static async readPaginated(page:number):Promise<{users:User[]|null, next: number | null}>{
        const db = getDb();
        const users:User[] | null = await db?.collection<User>('users').find().skip(page * 10).limit(10).toArray() ?? null;
        const count = await db?.collection<User>('users').countDocuments({});
        const next = count as number > page * 10 ? (page + 1) : null;
        return {users, next};
    }

    static async updateUser(id:string, user:User):Promise<{message: string, code:number}>{
        const db = getDb();
        const data = await db?.collection<User>('users').updateOne({_id: new ObjectId(id)}, {$set: user});
        if(data?.acknowledged){
            return {message:'Update was successfull', code: 200};
        }
        else{
            return {message:'Update was not successfull', code: 500}
        }
    }

    static async deleteUser(id:ObjectId){
        const db = getDb();
        const data = await db?.collection<User>('users').deleteOne({_id: id});
        if(data?.acknowledged){
            return {message:'The element was deleted successfuly', code:200};
        }
        else{
            return {message:'Deletion was not successful', code:500};
        }
    }

    static async readFilteredData(property:string, value:string){
        const db = getDb();
        const query = {[property] : value};
        const data: User[] | null = await db?.collection<User>('users').find(query).toArray() ?? null;
        if(data){
            return data;
        }
        else{
            return null;
        }
    }
}