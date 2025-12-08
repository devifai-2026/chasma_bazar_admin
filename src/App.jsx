import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Orders from './components/Orders/Orders'
import Product from './components/Products/Product'
import Categories from './components/Categories/Categories'
import Invoices from './components/Invoices/Invoices'
import Users from './components/Users/Users'
import Documents from './components/Documents/Documents'
import AddProduct from './components/Products/AddProduct'
import AddCategory from './components/Categories/AddCategory'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Product />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/add" element={<AddCategory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App