/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'inicio-portal',
        title: 'Inicio',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/inicio-portal',
        roles: ['admin', 'relator']
    },
    {
        id   : 'usuarios',
        title: 'Usuarios',
        type : 'basic',
        icon : 'heroicons_outline:cog-6-tooth',
        link : '/usuarios',
        roles: ['admin']
    },
    {
        id   : 'logs',
        title: 'Logs',
        type : 'basic',
        icon : 'heroicons_outline:newspaper',
        link : '/logs',
        roles: ['admin']
    },
    {
        id   : 'busqueda',
        title: 'Busqueda',
        type : 'basic',
        icon : 'heroicons_outline:magnifying-glass',
        link : '/busqueda',
        roles: ['admin', 'relator']
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'inicio-portal',
        title: 'Inicio',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/inicio-portal',
        roles: ['admin', 'relator']
    },
    {
        id   : 'usuarios',
        title: 'Usuarios',
        type : 'basic',
        icon : 'heroicons_outline:cog-6-tooth',
        link : '/usuarios',
        roles: ['admin']
    },
    {
        id   : 'logs',
        title: 'Logs',
        type : 'basic',
        icon : 'heroicons_outline:newspaper',
        link : '/logs',
        roles: ['admin']
    },
    {
        id   : 'busqueda',
        title: 'Busqueda',
        type : 'basic',
        icon : 'heroicons_outline:magnifying-glass',
        link : '/busqueda',
        roles: ['admin', 'relator']
    },
];
