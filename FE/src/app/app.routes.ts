import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Introduce } from './introduce/introduce';

export const routes: Routes = [
    {path: "Home", component:HomePage,
        children:[
            {path: "", component:Introduce},

        ]
    }
];
