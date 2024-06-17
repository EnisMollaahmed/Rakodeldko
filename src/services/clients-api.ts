const userEndpoint:string = "http://localhost:8000/users";

export class User{
    id?:string;
    name:string;
    username:string;
    email:string;
    password:string;
    constructor(name:string, username:string, email:string, password:string){
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

class UserDto{
    async fetchAll(){
        const usersData = await fetch(userEndpoint);
        if(!usersData.ok){
            throw Error("Error while reading data from user endpoint in UserDto fetchAll method!");
        }
        const users:User[] = await usersData.json();
        return users;
    }
    
    async fetchUser(id:string){
        const userData = await fetch(`${userEndpoint}/${id}`);
        if(!userData.ok){
            throw Error("Error while reading data about specific user in UserDto fetchUser method!")
        }
        const user:User = await userData.json();
        return user;
    }

    async createUser(user:User){
        const writeData = await fetch(userEndpoint,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(user),
        });
        if(!writeData.ok){
            throw Error("Error while writing the new user in UserDto writeUser method")
        }
        return await writeData.json();
    }

    async updateUser(user:User, id:string){
        const updateData = await fetch(`${userEndpoint}/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(user)
        });
        if(!updateData.ok){
            throw Error("Error while updating the user in UserDto updateUser method")
        }
        return await updateData.json();
    }

    async deleteUser(id:string){
        const deleteData = await fetch(`${userEndpoint}/${id}`,{
            method:"DELETE"
        });
        if(!deleteData.ok){
            throw Error("Error while deleteing the user in UserDto deleteUser method");
        }
    }
}

const userDto = new UserDto();

export default userDto;