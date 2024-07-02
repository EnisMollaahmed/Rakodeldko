import productApi, {Product} from "../services/products-api"
import { useLoaderData } from 'react-router-dom';
import ProductWidget from "./ProductWidget";
import { User } from '../services/clients-api';

export async function loader() : Promise<{products:Product[], user:User|null}>{
    const data:Product[] = await productApi.fetchAll();
    const products:Product[] = data.slice(-10);
    const item:string | null = sessionStorage.getItem('act-user');
    const user:User|null = item ? JSON.parse(item) : null;
    return {products, user};
}

export default function NewIn() {
    const {products, user} = useLoaderData() as {products:Product[], user:User|null};
    return (
        <section className='new-products-container'>
            {
                products.map((product:Product) => <ProductWidget isAdmin={user ? user.role === 'admin':false} isRegistered={user ? true : false} isOwned={user ? user.id === product.userId : false} name={product.name} image={product.image} id={product.id as string}/>)
            }
        </section>
    );
}