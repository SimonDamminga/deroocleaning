import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.Home), title: 'DeRooCleaning - Home' },
    { path: 'prices', loadComponent: () => import('./components/pricing/pricing').then(m => m.Pricing), title: 'Prijzen' },
    { path: 'about', loadComponent: () => import('./components/about/about').then(m => m.About), title: 'Over ons' },
    { path: 'contact', loadComponent: () => import('./components/contact/contact').then(m => m.Contact), title: 'Contact' },
    { path: '**', redirectTo: 'home' },
];
