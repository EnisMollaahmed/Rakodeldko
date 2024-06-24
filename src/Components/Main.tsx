import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User } from '../services/clients-api';

export default function Main(){

    const linkStyling = ({ isActive, isPending, isTransitioning }:any) =>
        [
          isPending ? "pending" : "",
          isActive ? "active" : "",
          isTransitioning ? "transitioning" : "",
        ].join(" ");

    const item = sessionStorage.getItem('act-user');
    let user:User|undefined = undefined;
    if(item){
        user = JSON.parse(item);
    }
        

    return (
        <>
            <header className='header-container'>
                <h1 className='name-capt'>Rakedelko</h1>
                {item && <p>{user?.name}</p>}
                <nav className='nav-container'>
                    <NavLink className={linkStyling} to='/'>Home</NavLink>
                    <NavLink className={linkStyling} to='/shop'>Shop</NavLink>
                    <NavLink className={linkStyling} to='/blogs'>Blogs</NavLink>
                    {!item && <NavLink className={linkStyling} to='/log-in'>Log In</NavLink>}
                    {!item && <NavLink className={linkStyling} to='/register'>Register</NavLink>}
                    {item && <NavLink className={linkStyling} to='/my-products'>My Products</NavLink>}
                    {item && <NavLink className={linkStyling} to='/my-blogs'>My Blogs</NavLink>}
                    {item && <NavLink className={linkStyling} to='/my-profile'>My Profile</NavLink>}
                </nav>
            </header>
            <main className='main-container'>
                <Outlet/>
            </main>
        </>
        
    );
}