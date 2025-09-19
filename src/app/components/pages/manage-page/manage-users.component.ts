import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from './user.service'; // Ajuste o caminho se necessário
import {Formulario, SubmissaoConferente, SubmissaoQualidade, User} from './manage-data';
import { UserDialogComponent } from './user-dialog.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatDialogModule, MatButtonModule,
    MatIconModule, MatTooltipModule, MatSortModule, MatPaginatorModule
  ],
  template: `
    <div class="user-management-container">
      <div class="toolbar">
        <h2>Utilizadores do Sistema</h2>
        <button mat-raised-button color="primary" (click)="openUserDialog()">
          <mat-icon>add</mat-icon>
          Adicionar Utilizador
        </button>
      </div>

      <div class="table-container mat-elevation-z2">
        <table mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Nome </th>
            <td mat-cell *matCellDef="let user"> {{user.name}} </td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Email </th>
            <td mat-cell *matCellDef="let user"> {{user.email}} </td>
          </ng-container>
          <ng-container matColumnDef="op">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Nível </th>
            <td mat-cell *matCellDef="let user"> {{getRoleName(user.op)}} </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Ações </th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button color="primary" (click)="openUserDialog(user)" matTooltip="Editar Utilizador">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteUser(user)" matTooltip="Apagar Utilizador">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          <tr class="mat-row" *matNoDataRow><td class="mat-cell" colspan="4">Nenhum utilizador encontrado.</td></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [
    `.user-management-container { padding: 16px; }`,
    `.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }`,
    `.table-container { border-radius: 8px; overflow: hidden; }`,
    `table { width: 100%; }`
  ]
})


export class ManageUsersComponent implements OnInit, AfterViewInit  {
  displayedColumns: string[] = ['name', 'email', 'op', 'actions'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,

  ) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.cdr.detectChanges();
    });
  }

  getRoleName(op: number): string {
    switch (op) {
      case 1: return 'Qualidade';
      case 2: return 'Conferente';
      case 3: return 'Gestor Qualidade';
      case 4: return 'Gestor Conferente';
      case 5: return 'Admin';
      default: return 'Desconhecido';
    }
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { user, isEdit: !!user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user && user.id) { // Edição
          this.userService.updateUser(user.id, result).subscribe(() => this.loadUsers());
        } else { // Adição
          this.userService.addUser(result).subscribe(() => this.loadUsers());
        }
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Tem a certeza que quer apagar o utilizador ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe(() => this.loadUsers());
    }
  }
}
