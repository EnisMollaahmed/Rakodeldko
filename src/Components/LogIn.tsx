import React, { useState } from 'react';
import {useForm} from 'react-hook-form';
import userDto, {User} from '../services/clients-api';
import { useLoaderData, useNavigate } from 'react-router-dom';

type InputData = {
    'email-username':string,
    password:string
}

export async function loader() : Promise<{users:User[]}>{
    const users:User[] = await userDto.fetchAll();
    return {users};
}

export default function LogIn(){
    const {users} = useLoaderData() as {users:User[]};
    console.log(users);
    const navigate = useNavigate();
    const {register, handleSubmit, formState} = useForm<InputData>();
    const {errors} = formState;
    const [isInvalidUser, setIsInvalidUser] = useState(false);

    const onSubmission = (data:InputData) => {
        const target:User|undefined = users.find(user=>(user.email === data['email-username'] || user.username === data['email-username']) && user.password === data.password);
        if(target){
            sessionStorage.setItem('act-user', JSON.stringify(target));
            navigate('..', {replace: true});
        }
        else{
            setIsInvalidUser(true);
        }
    }

    return(
        <form className='form' onSubmit={handleSubmit(onSubmission)}  noValidate>
            <input className='inp' type='text' {...register('email-username',{
                required:{
                    value:true,
                    message:'This field is required',
                }
            })} placeholder='Username or Email'/>
            <p className='error'>{errors['email-username']?.message}</p>
            <input className='inp' type='password' {...register('password',
                {
                    required:{
                        value:true,
                        message:'Password is required'
                    }
                }
            )} placeholder='Password'/>
            <p className='error'>{errors.password?.message}</p>
            <button type='submit' className='btn'>Submit</button>
            <p className='or-capt'>Or if you don't have an account</p>
            <button type='button' className='reg-btn' onClick={()=>navigate('/register',{ replace:true })}>Register</button>
            {isInvalidUser && <p className='error'>Input data is not valid</p>}
        </form>
    );
}