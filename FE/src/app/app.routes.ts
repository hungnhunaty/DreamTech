import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Introduce } from './introduce/introduce';
import { Register } from './register/register';
import { Login } from './login/login';
import { UserDashboard } from './Users/user-dashboard/user-dashboard';
import { User } from './Users/user/user';
import { UserShop } from './Users/user-shop/user-shop';
import { UserCart } from './Users/user-cart/user-cart';
import { UserCheckout } from './Users/user-checkout/user-checkout';
import { PcBuilder } from './Users/pc-builder/pc-builder';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminAccount } from './admin/admin-account/admin-account';
import { AdminCategory } from './admin/admin-category/admin-category';
import { AdminDiscount } from './admin/admin-discount/admin-discount';
import { AdminOrder } from './admin/admin-order/admin-order';
import { AdminProduct } from './admin/admin-product/admin-product';
import { AdminRating } from './admin/admin-rating/admin-rating';
import { authGuard, adminGuard } from './guards/auth.guard';

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

    //User Route Config - Yêu cầu đăng nhập
    {path: "user", component:User, canActivate: [authGuard],
        children:[
            {path: "", redirectTo:"shop", pathMatch:"full"},
            {path: "shop", component:UserShop},
            {path: "pc-builder", component:PcBuilder},
            {path: "cart", component:UserCart},
            {path: "checkout", component:UserCheckout},
            {path: "userDashboard", component:UserDashboard}
        ]
    },

    //Admin Route Config - Yêu cầu quyền Admin
    {path: "admin", component: AdminLayout, canActivate: [adminGuard],
        children:[
            {path: 'dashboard', component: AdminDashboard, data: {title: "Tổng quan"}},
            {path: 'account', component: AdminAccount, data: {title: "Quản lý tài khoản"}},
            {path: 'category', component: AdminCategory, data: {title: "Quản lý danh mục"}},
            {path: 'discount', component: AdminDiscount, data: {title: "Quản lý khuyến mãi"}},
            {path: 'order', component: AdminOrder, data: {title: "Quản lý đơn hàng"}},
            {path: 'product', component: AdminProduct, data: {title: "Quản lý sản phẩm"}},
            {path: 'rating', component: AdminRating, data: {title: "Quản lý đánh giá"}}
        ]
    }

];
