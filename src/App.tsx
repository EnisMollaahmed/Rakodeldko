import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Components/Home';
import Main from './Components/Main';
import Register, {loader as registerLoader} from './Components/Register';
import LogIn, {loader as loginLoader} from './Components/LogIn';
import Shop, { loader as shopLoader } from './Components/Shop';
import ProductPage, { loader as productPageLoader } from './Components/ProductPage';
import Blogs, {loader as blogsLoader} from './Components/Blogs';
import BlogPage, {loader as blogPageLoader} from './Components/BlogPage';
import MyBlogs, {loader as myBlogsLoader} from './Components/MyBlogs';
import MyProducts, {loader as myProductsLoader} from './Components/MyProducts';

const router = createBrowserRouter([
  {
    path:'/',
    element:<Main/>,
    children:[
      {
        index:true,
        element:<Home/>,
      },
      {
        path:"register",
        element:<Register />,
        loader:registerLoader,
      },
      {
        path:"log-in",
        element:<LogIn />,
        loader:loginLoader
      },
      {
        path:"shop",
        element:<Shop />,
        loader:shopLoader
      },
      {
        path:"/product/:productId",
        element:<ProductPage />,
        loader:productPageLoader
      },
      {
        path:"/blogs",
        element:<Blogs/>,
        loader:blogsLoader
      },
      {
        path:"/blog/:blogId",
        element:<BlogPage/>,
        loader:blogPageLoader
      },
      {
        path:"/my-blogs",
        element:<MyBlogs />,
        loader:myBlogsLoader
      },
      {
        path:"/my-products",
        element:<MyProducts />,
        loader:myProductsLoader
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;