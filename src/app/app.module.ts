import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    Tab1Page // Standalone component ને અહીં import માં રાખવું
  ],
  declarations: [] // અહીંથી Tab1Page કાઢી નાખ્યું છે જેથી એરર ન આવે
})
export class Tab1PageModule {}
