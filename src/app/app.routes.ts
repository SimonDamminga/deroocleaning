import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.Home), title: 'DeRooCleaning - Home' },
    { path: 'services', loadComponent: () => import('./components/services/services').then(m => m.Services), title: 'Prijzen' },
    { path: 'about', loadComponent: () => import('./components/about/about').then(m => m.About), title: 'Over ons' },
    { path: 'contact', loadComponent: () => import('./components/contact/contact').then(m => m.Contact), title: 'Contact' },
    { path: 'terms', loadComponent: () => import('./components/terms/terms').then(m => m.Terms), title: 'Algemene voorwaarden'},
    { path: 'privacy', loadComponent: () => import('./components/privacy/privacy').then(m => m.Privacy), title: 'Privacyverklaring'},
    { path: '**', redirectTo: 'home' },
];
