import React from "react";
import {useNavigate} from 'react-router-dom';
import productApi from "../services/products-api";

interface ProductWidgetProps {
    name: string;
    image: string;
    id: string;
    isOwned?: boolean; // Marked as optional
}

export default function ProductWidget({name, image, id, isOwned = false}:ProductWidgetProps){//TODO add to cart products
    const navigate = useNavigate();
    const handleDelete = async () => {
        await productApi.deleteProduct(id);
        navigate('../my-products');
    }
    return (
        <section className='product-widget'>
            <img className='image' src={image} alt={`product:{name}`}/>
            <p className='prod-name'>{name}</p>
            <button type='button' onClick={()=>navigate(`/product/${id}`)}>View</button>
            {!isOwned && <button className="cart-btn" type='button'>Add to Cart</button>}
            {isOwned && <button className="delete-btn" type="button" onClick={handleDelete}>Delete</button>}

        </section>
    );
}