export const rolePermissions: any = {
  DIRECTOR: { allowed: 'all menu' },
  SALES: { allowed: ['order', 'order-summary', 'cart', 'invoice', 'stock', 'delivery', 'product', 'log'] },
  OFFICE: { disallowed: ['employee'] },
  CUTTER: { allowed: ['product', 'log'] },
  TAILOR: { allowed: ['product', 'log'] },
  COURIER: { allowed: ['delivery', 'product', 'log'] }
};
