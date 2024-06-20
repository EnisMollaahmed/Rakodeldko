import React from 'react';
import userDto, { User } from '../services/clients-api';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

type FieldValues = {
    name:string,
    username:string,
    email:string,
    password:string,
    repeatPassword:string
}

export function loader():{user:User}{
    const item:string = sessionStorage.getItem("act-user") as string;
    const user:User = JSON.parse(item);
    return {user};
}

export default function MyProfile(){
    const {user} = useLoaderData() as {user:User};
    const { register, handleSubmit, watch, formState } = useForm<FieldValues>({
        defaultValues:{
            name:user.name,
            username:user.username,
            email:user.email,
            password:user.password,
            repeatPassword:user.password
        }
    });
    const navigate = useNavigate();
    const watchPassword = watch('password');
    const { errors, isDirty, isSubmitting, isValid } = formState;

    const handleDataSubmission = async (data:FieldValues) => {
        user.name = data.name;
        user.username = data.username;
        user.email = data.email;
        user.password = data.password;
        await userDto.updateUser(user, user.id as string);
        navigate('../my-profile');
    }

    return (
        <form className='profile-form' noValidate onSubmit={handleSubmit(handleDataSubmission)}>
            <input type='text' className='inp' {...register('name', {
                required:"Name is required",
                minLength:{
                    value:5,
                    message:'Name must have at least 5 characters'
                },
                maxLength:{
                    value:35,
                    message:'Name can have maximum 35 characters'
                },
                pattern:{
                    value:/^[a-zA-Z ]+$/,
                    message:'Name can contain only letters'
                }
            })} placeholder='Name'/>
            <p className='error'>{errors.name?.message}</p>
            <input type='text' className='inp' {...register('username', {
                required:'Username is required',
                minLength:{
                    value:8,
                    message:'Username must contains 8 characters at least'
                },
                maxLength:{
                    value:20,
                    message:'Username can have max 20 characters'
                }
            })} placeholder='Username'/>
            <p className='error'>{errors.username?.message}</p>
            <input type='text' className='inp' {...register('email', {
                required:'Email is required',
                minLength:{
                    value:8,
                    message:'Email must contains at least 8 characters'
                },
                pattern:{
                    value:/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,4}$/,
                    message:'Email has invlaid characters'
                }
            })} placeholder='Email'/>
            <p className='error'>{errors.email?.message}</p>
            <input type='password' className='inp' {...register('password',{
                required:'Password is required',
                pattern:{
                    value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:'Invalid characters are used in password'
                },
                minLength:{
                    value:8,
                    message:'Password must be at least 8 characters'
                },
                maxLength:{
                    value:20,
                    message:'Password can have maximum 20 elements'
                }
            })} placeholder='Password'/>
            <p className='error'>{errors.password?.message}</p>
            <input type='password' className='inp' {...register('repeatPassword', {
                required:'Repeat password is required',
                disabled:watchPassword.length === 0,
                validate:{
                    isSame:(fieldValue)=>{
                        return fieldValue !== watchPassword && 'Password and Repeat Password field must be equal'
                    }
                }
            })} placeholder='Repeat Password'/>
            <p className='error'>{errors.repeatPassword?.message}</p>
            <button className='submit-btn' type='button' disabled={(!isDirty && !isValid) || isSubmitting}>Submit</button>
        </form>
    );
}