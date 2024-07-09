import React from 'react';
import {useNavigate} from 'react-router-dom';

interface BlogWidgetInfo{
    id:string;
    image:string;
    title:string;
    shortDescription:string;
    post:number;
    isOwned?:boolean;
    isAdmin?:boolean
}

export default function BlogWidget({id, image ,title, shortDescription, post, isOwned = false, isAdmin = false}:BlogWidgetInfo){
    const navigate = useNavigate();
    const date = new Date(post);
    return(
        <section className='blog-widget'>
            <img className='image' src={image} alt={shortDescription}/>
            <p className='title'>{title}</p>
            <p className='short-description'>{shortDescription}</p>
            <p className='post-date'>{date.toString()}</p>
            <button type='button' className='view-btn blog-btn' onClick={()=>navigate(`/blog/${id}`)}>View</button>
            {(isOwned || isAdmin) && <button className='delete-btn blog-btn'>Delete</button>}
            {!isOwned && <button className='edit-btn blog-btn' onClick={()=>navigate(`/man-blog/edit/${id}`)}>Edit</button>}
        </section>
    );
}