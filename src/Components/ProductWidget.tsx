import React from "react";
import {useNavigate} from 'react-router-dom';
import productApi from "../services/products-api";
import cartApi from "../services/cart-api";

interface ProductWidgetProps {
    name: string;
    image: string;
    id: string;
    isRegistered:boolean;
    isOwned?: boolean;
    isAdmin?:boolean;
}

export default function ProductWidget({name, image, id, isRegistered = false, isOwned = false, isAdmin= false}:ProductWidgetProps){//TODO add to cart products
    const navigate = useNavigate();
    const handleDelete = async () => {
        await productApi.deleteProduct(id);
        navigate(0);
    }
    const handleAddToCart = () => {
        console.log('here')
        if(isRegistered){
            cartApi.addToCart({id:id, quantity:1});
            console.log('added');
        }
        else{
            navigate('/log-in');
        }
    }
    console.log('id',id);
    return (
        <section className='product-widget'>
            <img className='image' src={image} alt={`product:{name}`}/>
            <p className='prod-name'>{name}</p>
            <button type='button' onClick={()=>navigate(`/product/${id}`)}>View</button>
            {!isOwned && <button className="cart-btn" type='button' onClick={handleAddToCart}>Add to Cart</button>}
            {isOwned && <button className="edit-btn" type='button' onClick={()=>navigate(`/man-product/edit/${id}`)}>Edit</button>}
            {(isOwned || isAdmin) && <button className="delete-btn" type="button" onClick={handleDelete}>Delete</button>}

        </section>
    );
}