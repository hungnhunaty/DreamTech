import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Introduce } from './introduce/introduce';
import { Register } from './register/register';

export const routes: Routes = [
    {path: "home", component:HomePage,
        children:[
            {path: "", component:Introduce},
        ]
    },
    {path: "register", component:Register}
];
