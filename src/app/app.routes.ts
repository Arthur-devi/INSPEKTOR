import { Routes } from '@angular/router';
import { formAuthGuard } from './form-auth.guard';
import { authGuard } from './components/pages/login/auth.guard'; // 1. IMPORTAR O GUARDA CORRETO
import { roleGuard } from './components/pages/login/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard] // 2. USAR O GUARDA CORRETO
  },
  {
    path: 'formularios',
    canActivate: [authGuard], // 3. PROTEGER A ROTA "PAI"
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/pages/forms-selection/forms-selection.component')
            .then(m => m.FormsSelectionComponent),
      },
      {
        path: 'wizard',
        loadComponent: () =>
          import('./components/pages/checklist-wizard/checklist-wizard.component')
            .then(m => m.ChecklistWizardComponent),
            canActivate: [formAuthGuard,roleGuard], // Este guarda específico para formulários está correto
            data: { roles: [2, 4, 5] } // Só utilizadores conferentes (2), gestores conferentes (4) e Admins (5)
      },
      {
        path: 'sachets',
        loadComponent: () =>
          import('./components/pages/sachets-form/sachets-form.component')
            .then(m => m.SachetsFormComponent),
            canActivate: [formAuthGuard,roleGuard], // Este guarda específico para formulários está correto
            data: { roles: [1, 4, 5] } // Só utilizadores de Qualidade (1), gestores qualidade (3) e Admins (5)
      }
      // Adicione aqui outros formulários, sempre com o 'canActivate: [formAuthGuard]'
    ]
  },
  {
    path: 'relatorios',
    loadComponent: () =>
      import('./components/pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
        canActivate: [roleGuard], // 2. USAR O GUARDA CORRETO
        data: { roles: [3, 4, 5] } // Só Gestores e Admins
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/pages/login/login.component')
        .then(m => m.LoginComponent)
    // A rota de login NUNCA é protegida
  },
  {
    path: 'gerenciar',
    loadComponent: () =>
      import('./components/pages/manage-page/manage-page.component')
        .then(m => m.ManagePageComponent),
        canActivate: [roleGuard],
        data: { roles: [3, 4, 5] } // Só Gestores e Admins

  },
  {
    path: '**', // Rota "catch-all" para páginas não encontradas
    redirectTo: ''
  }
];
