import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Components/Home';
import Main from './Components/Main';
import Register, {loader as registerLoader} from './Components/Register';
import LogIn, {loader as loginLoader} from './Components/LogIn';

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