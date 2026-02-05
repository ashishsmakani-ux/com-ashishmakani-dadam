import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab2Page {
  history: any[] = [];
  constructor() {}

  ionViewWillEnter() {
    const data = localStorage.getItem('dadam_history');
    this.history = data ? JSON.parse(data) : [];
  }

  deleteItem(id: number) {
    if(confirm("આ હિસાબ ડિલીટ કરવો છે?")) {
      this.history = this.history.filter(item => item.id !== id);
      localStorage.setItem('dadam_history', JSON.stringify(this.history));
    }
  }

  shareAgain(item: any) {
    const msg = `*દાડમ મંડી ઇતિહાસ*%0A📅 તારીખ: ${item.date}%0A🏢 મંડી: ${item.mandi}%0A⚖️ વજન: ${item.totalW} kg%0A💵 *ચોખ્ખી આવક: ₹${item.net}*%0A📈 સરેરાશ: ₹${item.avg}/kg`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
