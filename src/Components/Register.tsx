import React from 'react';
import { useForm } from 'react-hook-form';
import userDto from '../services/clients-api';
import {useLoaderData, useNavigate} from 'react-router-dom';
import { User } from '../services/clients-api';

type UserData = {
    name:string,
    username:string,
    email:string,
    password:string,
    'repeat-password':string,

}

export async function loader():Promise<{users:User[]}>{
    const users:User[] = await userDto.fetchAll();
    return {users};
}

export default function Register(){
    const {users} = useLoaderData() as {users:User[]};
    const {register, handleSubmit, formState, watch} = useForm<UserData>({
        mode:'onBlur'
    });
    const {errors, isDirty, isValid, isSubmitting} = formState;
    const watchPassword = watch("password");
    const navigate = useNavigate();

    const onSubmission = (data:UserData) =>{
        console.log(data);
        const user = new User(data.name, data.username, data.email, data.password);
        userDto.createUser(user);
        sessionStorage.setItem('act-user',JSON.stringify(user));
        navigate('..',{replace:true})
    }

    return (
        <form className='form' onSubmit={handleSubmit(onSubmission)}  noValidate>
            <input type='text' {...register('name',{
                minLength:{
                    value:2,
                    message:'Name must contain at least 2 charachters'
                },
                required:{
                    value:true,
                    message:'Name field is required'
                }
            })} placeholder='Name' className='inp' autoComplete='name'/>
            <p>{errors.name?.message}</p>
            <input type='text' {...register('username',{
                minLength:{
                    value:8,
                    message:'Username must be at least 8 characters'
                },
                required:{
                    value:true,
                    message:'Username field is required'
                },
                pattern:{
                    value:/^[A-Za-z0-9_]+$/,
                    message:'Username can contain only letters, digits and underscores'
                },
                validate:{
                    doesNotExist:(fieldValue)=>{
                        const target = users.find(user=>user.username === fieldValue);
                        console.log(target);
                        return target===undefined || "The username already exists";
                    }
                }
            })} placeholder='Username' className='inp' autoComplete='username'/>
            <p>{errors.username?.message}</p>
            <input type='email' {...register('email',{
                required:{
                    value:true,
                    message:'Email field is required'
                },
                pattern:{
                    value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:'Invalid email was passed'
                },
                minLength:{
                    value:10,
                    message:'The email must be at least 10 characters'
                },
                validate:{
                    doesNotExist:(fieldValue)=>{
                        const target = users.find(user=>user.email === fieldValue);
                        return target === undefined || 'Email address already exists'
                    }
                }
            })} placeholder='Email' className='inp' autoComplete='email'/>
            <p>{errors.email?.message}</p>
            <input type='password' {...register('password', {
                minLength:{
                    value:8,
                    message: 'Password must be at least 8 charachters long'
                },
                required:{
                    value:true,
                    message: 'Password field is required'
                },
                pattern:{
                    value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Invalid password was passed'
                },
            })} placeholder='Password' className='inp' autoComplete='new-password'/>
            <p>{errors.password?.message}</p>
            <input type='password' {...register('repeat-password', {
                required:{
                    value:true,
                    message: 'Repeating password is required'
                },
                disabled:watchPassword === ""
            })} placeholder='Repet Password' className='inp' autoComplete='new-password'/>
            <p>{errors['repeat-password']?.message}</p>
            <button type='submit' disabled={!(isDirty || isValid) || isSubmitting}>Submit</button>
        </form>
    );
}