import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule }                        from '@angular/common';
import { GridModule }                          from '@coreui/angular';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import { AuthService } from '../login/auth.service'; // 1. IMPORTAR O SERVIÇO


@Component({
  selector: 'app-home',
  imports: [CommonModule, GridModule,MatButtonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(10px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in',
          style({ opacity: 0, transform: 'translateX(-10px)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
