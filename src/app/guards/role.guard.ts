import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {rolePermissions} from '../const/role-permission';

export const roleGuard = (menu: string): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const userStr = localStorage.getItem('user');
    if (!userStr) return router.createUrlTree(['/login']);

    const user = JSON.parse(userStr);
    const role = user?.role?.name;

    const permission = rolePermissions[role];

    if (!permission) return router.createUrlTree(['/unauthorized']);

    if (permission.allowed === 'all menu') return true;

    if (permission.allowed) {
      if (permission.allowed.includes(menu)) return true;
    }

    if (permission.disallowed) {
      if (!permission.disallowed.includes(menu)) return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
};
