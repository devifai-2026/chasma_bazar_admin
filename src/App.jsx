import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
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
import Company from './components/Company/Company'
import Frame from './components/Frame/Frame'
import AddCompany from './components/Company/AddCompany'
import AddFrame from './components/Frame/AddFrame'
import Discount from './components/Discount/Discount'
import AddDiscount from './components/Discount/AddDiscount'
import ViewDiscount from './components/Discount/ViewDiscount'
import PromoCode from './components/PromoCode/PromoCode'
import AddPromo from './components/PromoCode/AddPromo'
import UpdatePromo from './components/PromoCode/UpdatePromo'
import ViewPromo from './components/PromoCode/ViewPromo'
import AddBanner from './components/Banner/AddBanner'
import UpdateBanner from './components/Banner/UpdateBanner'
import Banner from './components/Banner/Banner'
import ViewBanner from './components/Banner/ViewBanner'
import UpdateDiscount from './components/Discount/UpdateDiscount'
import UpdateFrame from './components/Frame/UpdateFrame'
import ViewFrame from './components/Frame/ViewFrame'
import ViewCompany from './components/Company/ViewCompany'
import UpdateCompany from './components/Company/UpdateCompany'
import { isAuthenticated } from './utils/auth';
import { Toaster } from 'react-hot-toast'

// Improved PrivateRoute with debugging
const PrivateRoute = () => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

function App() {
  return (
    <Router>
    <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 1000,
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          
          
          {/* All protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Product />} />
            <Route path="/products/add" element={<AddProduct />} />
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
            <Route path="/company" element={<Company />} />
            <Route path="/company/add" element={<AddCompany />} />
            <Route path="/company/view/:id" element={<ViewCompany />} />
            <Route path="/company/update/:id" element={<UpdateCompany />} />
            <Route path="/frame" element={<Frame />} />
            <Route path="/frame/add" element={<AddFrame />} />
            <Route path="/frame/update/:id" element={<UpdateFrame />} />
            <Route path="/frame/view/:id" element={<ViewFrame />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/discount/add" element={<AddDiscount />} />
            <Route path="/discount/view/:id" element={<ViewDiscount />} />
            <Route path="/discount/update/:id" element={<UpdateDiscount />} />
            <Route path="/promoCode" element={<PromoCode />} />
            <Route path="/promoCode/add" element={<AddPromo />} />
            <Route path="/promoCode/update/:id" element={<UpdatePromo />} />
            <Route path="/promoCode/view/:id" element={<ViewPromo />} />
            <Route path="/banner" element={<Banner />} />
            <Route path="/banner/add" element={<AddBanner />} />
            <Route path="/banner/update/:id" element={<UpdateBanner />} />
            <Route path="/banner/view/:id" element={<ViewBanner />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App