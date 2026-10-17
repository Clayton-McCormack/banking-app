import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from './button/button';

@NgModule({
  declarations: [Button],
  imports: [CommonModule],
  exports: [Button],
})
export class SharedModule {}
