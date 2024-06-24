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
import AddNewBlog, {loader as addEditBlogLoader} from './Components/AddNewBlogs';
import MyProfile, {loader as myProfileLoader} from './Components/MyProfile';
import AddNewProducts, {loader as addEditProductLoader} from './Components/AddNewProducts';
import OrderHistory, {loader as orderHistoryLoader} from './Components/OrdersHistory';
import IncomingOrder, {loader as incomingOrdersLoader}  from './Components/IncomingOrders';
import Cart, {loader as cartLoader} from './Components/Cart';
import Checkout, {loader as checkoutLoader} from './Components/Checkout';

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
      },
      {
        path:"/man-blog/:type/:blogId",
        element:<AddNewBlog/>,
        loader:addEditBlogLoader
      },
      {
        path:"/man-product/:type/:productId",
        element:<AddNewProducts/>,
        loader:addEditProductLoader
      },
      {
        path:"/my-profile",
        element:<MyProfile />,
        loader:myProfileLoader
      },
      {
        path:'/my-orders',
        element:<OrderHistory/>,
        loader:orderHistoryLoader
      },
      {
        path:'/incoming-orders',
        element:<IncomingOrder/>,
        loader:incomingOrdersLoader
      },
      {
        path:'/cart',
        element:<Cart/>,
        loader:cartLoader
      },
      {
        path:'/checkout',
        element:<Checkout/>,
        loader: checkoutLoader
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