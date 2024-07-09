import {Db, MongoClient} from 'mongodb';

let _db:Db;

const mongoConnect = (callback:any) => {
    MongoClient.connect('mongodb+srv://enissuper02:uOL94vNLg23uMFtN@cluster.scwhl3u.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster')
    .then(
        (client)=>{
            console.log('connected');
            _db = client.db();
            callback();
        }
    )
    .catch((err)=>{
        console.log(err)
        throw err;
    })
}

export const getDb = () =>{
    if(_db){
        return _db;
    }
}

export default mongoConnect;