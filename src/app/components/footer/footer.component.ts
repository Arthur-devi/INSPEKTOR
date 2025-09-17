// src/app/components/footer/footer.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule }                        from '@angular/common';
import { GridModule }                          from '@coreui/angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, GridModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
