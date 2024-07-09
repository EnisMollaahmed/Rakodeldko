import express from 'express';
import { User } from '../models/User';
import { ObjectId } from 'mongodb';

const router = express.Router();

const extractUser = (user:User)=>{
    return {id:user._id, name: user.name, username:user.username, email:user.email, password: user.password, role:user.role};
}

router.get('/all', async (req, res)=>{
    const users:User[] = await User.readAll();
    const usersToReturn = users.map((user:User)=>{
        return {id:user._id, name: user.name, username:user.username, email:user.email, password: user.password, role:user.role};
    });
    res.status(200).send(usersToReturn);
});

router.get('/page/:num', async (req, res) =>{
    const {users, next}:{users:User[]|null, next: number | null} = await User.readPaginated(Number(req.params.num));
    if(users){
        const toReturn = users.map((user:User)=>{
            return {id: user._id.toString(), name: user.name, username: user.username, email: user.email, password: user.password, role: user.role}
        })
        res.status(200).send({toReturn, next});
    }
    else{
        res.statusCode = 404;
        res.statusMessage = 'Users not found';
        res.send([]);
    }
});

router.get('/filter/:property-:value', async (req, res) => {
    const users:User[] | null = await User.readFilteredData(req.params.property, req.params.value);
    res.status(users? 200 : 404).send(users ? users.map((user:User)=> extractUser(user)) : []);
});

router.get('/:id', async (req, res) => {
    const user:User|null = await User.readSpecificUser(req.params.id);
    if(user){
        res.status(200).send({id: user._id.toString(), name:user.name, username:user.username, email:user.email, password:user.password, role:user.role});
    }
    else{
        res.statusCode = 404;
        res.statusMessage = 'User not found';
        res.send(null);
    }
});

router.post('/add', async(req, res)=>{
    const newUser = req.body;
    console.log('in add',newUser);
    console.log('legit');
    const user:User = new User(newUser.name, newUser.username, newUser.email, newUser.password, newUser.role, newUser.id);
    console.log('in add user',user);
    await user.save();
});

router.put('/update/:id', async (req, res) =>{
    const id = req.params.id;
    const userToUpdate= req.body;
    const user:User = new User(userToUpdate.name, userToUpdate.username, userToUpdate.email, userToUpdate.password, userToUpdate.role, id);
    const {message, code} = await User.updateUser(id, user);
    res.status(code).json({message:message});
});

router.delete('/delete/:id', async (req, res)=>{
    const id = req.params.id;
    const {message, code} = await User.deleteUser(new ObjectId(id));
    res.status(code).json({message:message});
});

export {router as usersRouter};