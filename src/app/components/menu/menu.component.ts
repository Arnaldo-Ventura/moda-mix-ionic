import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TypeEnum } from 'src/app/shared/enums/type.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menu = [
    {
      title: 'Cartões',
      children: [
        {
          title: 'Receitas',
          path: '/admin/cartoes',
          icon: 'journal-outline',
        },
        {
          title: 'Operadoras',
          path: '/admin/operadoras',
          icon: 'business-outline',
        },
        {
          title: 'Despesas',
          path: '/admin/cartoes-despesas',
          icon: 'journal-outline',
        },
      ],
    },
    {
      title: 'Categorias',
      path: '/admin/categorias',
      icon: 'layers-outline',
    },
    {
      title: 'Configurações',
      path: '/admin/configuracoes',
      icon: 'settings-outline',
    },
    {
      title: 'Clientes',
      path: '/admin/clientes',
      icon: 'people-outline',
    },
    {
      title: 'Fornecedores',
      path: '/admin/fornecedores',
      icon: 'people-circle-outline',
    },
    {
      title: 'Funcionários',
      path: '/admin/funcionarios',
      icon: 'person-outline',
    },
    {
      title: 'Home',
      path: '/',
      icon: 'home-outline',
    },
    {
      title: 'Lançamentos',
      children: [
        {
          title: 'PDV',
          path: '/admin/lancamentos/pdv',
          icon: 'wallet-outline',
        },
        {
          title: 'Caixa',
          path: '/admin/lancamentos/caixa',
          icon: 'wallet-outline',
        },
        {
          title: 'Retirada',
          path: '/admin/lancamentos/retirada-caixa',
          icon: 'cash-outline',
        },
        {
          title: 'Despesas',
          path: '/admin/lancamentos/despesas',
          icon: 'cash-outline',
        },
        {
          title: 'Confirmar',
          path: '/admin/lancamentos/confirmar',
          icon: 'cash-outline',
        },
      ],
    },
    {
      title: 'Marcas',
      path: '/admin/marcas',
      icon: 'business-outline',
    },
    {
      title: 'Permissões',
      path: '/admin/permissoes',
      icon: 'key-outline',
    },
    {
      title: 'Produtos',
      path: '/admin/produtos',
      icon: 'storefront-outline',
    },
    {
      title: 'Plano de Contas',
      path: '/admin/plano-contas',
      icon: 'clipboard-outline',
    },
    {
      title: 'Vendas',
      children: [
        {
          title: 'Vender',
          path: '/admin/lancamentos/vender',
          icon: 'wallet-outline',
        },
      ],
    },
  ];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  navegationTo(route: string) {
    this.navCtrl.navigateRoot(route);
  }
}
