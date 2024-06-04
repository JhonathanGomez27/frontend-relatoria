import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { hasRoleGuard } from './core/auth/guards/has-role.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/inicio-portal'
    {path: '', pathMatch : 'full', redirectTo: 'inicio-portal'},

    // Redirect signed-in user to the '/inicio-portal'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'inicio-portal'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            // {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes'), title: 'Relatoría | Recuperacion de contraseña'},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes'), title: 'Relatoría | Reiniciar contraseña'},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes'), title: 'Relatoría | Iniciar sesión'},
            // {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            // {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    // {
    //     path: '',
    //     component: LayoutComponent,
    //     data: {
    //         layout: 'empty'
    //     },
    //     children: [
    //         {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
    //     ]
    // },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {
                path: 'inicio-portal',
                canActivate: [hasRoleGuard],
                data: {
                    expectedRole: ['admin', 'relator']
                },
                loadChildren: () => import('app/modules/admin/inicio-portal/inicio-portal.routes')
            },
            {
                path: 'busqueda',
                canActivate: [hasRoleGuard],
                data: {
                    expectedRole: ['admin', 'relator']
                },
                loadChildren: () => import('app/modules/admin/busqueda/busqueda.routes')
            },
            {
                path: 'usuarios',
                canActivate: [hasRoleGuard],
                data: {
                    expectedRole: ['admin']
                },
                loadChildren: () => import('app/modules/admin/usuarios/usuarios.routes')
            },
            {
                path: 'logs',
                canActivate: [hasRoleGuard],
                data: {
                    expectedRole: ['admin']
                },
                loadChildren: () => import('app/modules/admin/logs/logs.routes')
            },
            {
                path: '**',
                redirectTo: 'inicio-portal'
            }
        ]
    }
];
