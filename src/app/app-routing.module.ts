import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'configuracoes',
        loadChildren: () =>
          import('./pages/settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
      /*  {
        path: 'lancamentos',
        loadChildren: () =>
          import('./pages/sales/sales.module').then((m) => m.SalesPageModule),
      }, */
      /*  {
        path: 'vender',
        loadChildren: () =>
          import('./pages/sales/sales.module').then((m) => m.SalesPageModule),
      }, */

      {
        path: 'cartoes',
        loadChildren: () =>
          import('./pages/cards/cards.module').then((m) => m.CardsPageModule),
      },
      {
        path: 'cartoes-despesas',
        loadChildren: () =>
          import('./pages/cards-expense/cards-expense.module').then(
            (m) => m.CardsExpensePageModule
          ),
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('./pages/categories/categories.module').then(
            (m) => m.CategoriesPageModule
          ),
      },
      {
        path: 'marcas',
        loadChildren: () =>
          import('./pages/brands/brand.module').then((m) => m.BrandPageModule),
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./pages/products/products.module').then(
            (m) => m.ProductsPageModule
          ),
      },
      {
        path: 'plano-contas',
        loadChildren: () =>
          import('./pages/accounts/accounts.module').then(
            (m) => m.AccountsPageModule
          ),
      },
      {
        path: 'funcionarios',
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersPageModule),
      },
      {
        path: 'permissoes',
        loadChildren: () =>
          import('./pages/permissions/permissions.module').then(
            (m) => m.PermissionsPageModule
          ),
      },
      {
        path: 'sistema',
        loadChildren: () =>
          import('./pages/app-start/app-start.module').then(
            (m) => m.AppStartPageModule
          ),
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./pages/customers/customers.module').then(
            (m) => m.CustomersPageModule
          ),
      },
      {
        path: 'fornecedores',
        loadChildren: () =>
          import('./pages/suppliers/suppliers.module').then(
            (m) => m.SuppliersPageModule
          ),
      },
      {
        path: 'operadoras',
        loadChildren: () =>
          import('./pages/operators/operators.module').then(
            (m) => m.OperatorsPageModule
          ),
      },
      {
        path: 'lancamentos',
        children: [
          {
            path: 'caixa',
            loadChildren: () =>
              import('./pages/cashier/cashier.module').then(
                (m) => m.CashierPageModule
              ),
          },
          {
            path: 'despesas',
            loadChildren: () =>
              import('./pages/bills/bills.module').then(
                (m) => m.BillsPageModule
              ),
          },
          {
            path: '',
            loadChildren: () =>
              import('./pages/transactions/transactions.module').then(
                (m) => m.TransactionsPageModule
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
