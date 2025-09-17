// src/app/app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponents } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponents, FooterComponent,CommonModule],
  template: `
    <app-header *ngIf="showLayout"></app-header>
    <main class="flex-grow">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="showLayout"></app-footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showLayout = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showLayout = !['/login'].includes(event.urlAfterRedirects);
      });
  }
}
