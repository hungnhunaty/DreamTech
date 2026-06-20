import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Introduce } from './introduce/introduce';
import { Register } from './register/register';
import { Login } from './login/login';
import { Component } from '@angular/core';
import { UserDashboard } from './Users/user-dashboard/user-dashboard';
import { User } from './Users/user/user';
import { flush } from '@angular/core/testing';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminAccount } from './admin/admin-account/admin-account';
import { AdminCategory } from './admin/admin-category/admin-category';
import { AdminDiscount } from './admin/admin-discount/admin-discount';
import { AdminOrder } from './admin/admin-order/admin-order';
import { AdminProduct } from './admin/admin-product/admin-product';
import { AdminRating } from './admin/admin-rating/admin-rating';
import { AdminRevenue } from './admin/admin-revenue/admin-revenue';

export const routes: Routes = [
    {path: "", redirectTo:"home", pathMatch:"full"},

    {path: "home", component:HomePage,
        children:[
            {path: "", redirectTo: "introduce", pathMatch:"full"},
            {path: "introduce", component: Introduce}
        ]
    },
    {path: "register", component:Register},
    {path: "login", component:Login},

    //User Route Config
    {path: "user", component:User, 
        children:[
            {path: "", redirectTo:"userDashboard", pathMatch:"full"},
            {path: "userDashboard", component:UserDashboard}
        ]
    },

    //Admin Route Config
    {path: "admin", component: AdminLayout,
        children:[
            {path: 'dashboard', component: AdminDashboard},
            {path: 'account', component: AdminAccount},
            {path: 'category', component: AdminCategory},
            {path: 'discount', component: AdminDiscount},
            {path: 'order', component: AdminOrder},
            {path: 'product', component: AdminProduct},
            {path: 'rating', component: AdminRating},
            {path: 'revenue', component: AdminRevenue},
        ]
    }

];
