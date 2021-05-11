import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Home from './core/Home';
import PrivateRoute from './auth/PrivateRoute'
import Dashboard from './user/userDashboard';


import AdminRoute from './auth/AdminRoute'
import AdminDashboard from './user/AdminDashboard';

import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';

const Routes = () =>{
    return (
        <BrowserRouter>
       
            <Switch>
            <Route path="/" exact component={Home} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/signup" exact component={Signup} />

                <PrivateRoute path="/user/dashboard" component={Dashboard} />
                <AdminRoute path="/admin/dashboard" component={AdminDashboard} />
                <AdminRoute path="/create/category" component={AddCategory} />
                <AdminRoute path="/create/product" component={AddProduct} />
            </Switch>
        </BrowserRouter>
    )
}
export default Routes;