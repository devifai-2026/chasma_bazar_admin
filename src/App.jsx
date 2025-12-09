import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Orders from './components/Orders/Orders'
import Product from './components/Products/Product'
import Categories from './components/Categories/Categories'
import Invoices from './components/Invoices/Invoices'
import Users from './components/Users/Users'
import AddProduct from './components/Products/AddProduct'
import AddCategory from './components/Categories/AddCategory'
import ProductView from './components/Products/ProductView'
import ProductEdit from './components/Products/ProductEdit'
import InvoiceView from './components/Invoices/InvoiceView'
import UserAdd from './components/Users/UserAdd'
import UserEdit from './components/Users/UserEdit'
import MyProfile from './components/MyProfile/MyProfile'
import Login from './components/MyProfile/Login'
import OrderView from './components/Orders/OrderView'
import OrderUpdate from './components/Orders/OrderUpdate'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Product />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="/products/view/:id" element={<ProductView />} />
           <Route path="/products/edit/:id" element={<ProductEdit />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/add" element={<AddCategory />} />
          <Route path="/orders" element={<Orders />} />
               <Route path="/orders/view/:id" element={<OrderView />} /> 
                 <Route path="/orders/update/:id" element={<OrderUpdate />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/view/:id" element={<InvoiceView />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<UserAdd />} />
          <Route path="/users/edit/:id" element={<UserEdit />} /> 
           <Route path="/my-profile" element={<MyProfile />} /> 
           <Route path="/login" element={<Login />} /> 
        </Routes>
      </div>
    </Router>
  )
}

export default App