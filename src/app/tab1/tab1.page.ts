import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page implements OnInit {
  history: any[] = [];
  rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 

  constructor() {}

  ngOnInit() {
    this.loadHistory();
  }

  saveData() {
    let totalW = 0, totalS = 0;
    const dateInput = document.getElementById('date') as HTMLInputElement;
    const date = dateInput ? dateInput.value : '';
    
    for (let i = 1; i <= 10; i++) {
      const w = Number((document.getElementById(`w${i}`) as HTMLInputElement)?.value) || 0;
      const p = Number((document.getElementById(`p${i}`) as HTMLInputElement)?.value) || 0;
      const type = Number((document.getElementById(`t${i}`) as HTMLSelectElement)?.value) || 20;
      totalW += w;
      totalS += (type === 20 ? (w / 20) * p : w * p);
    }

    if (totalW === 0 || !date) {
      alert("તારીખ અને હિસાબની વિગત ભરો!");
      return;
    }

    const weightCrates = totalW / 20;
    const grading = (document.getElementById('gradingMode') as HTMLSelectElement)?.value;
    const exp = weightCrates * ((grading === 'mandi' ? 13 : 0) + 15);
    
    const lc = Number((document.getElementById('loadedCrates') as HTMLInputElement)?.value) || weightCrates;
    const tr = Number((document.getElementById('transRate') as HTMLInputElement)?.value) || 0;
    const tt = (document.getElementById('transType') as HTMLSelectElement)?.value;
    const transAmt = (tt === 'perCrate' ? lc * tr : tr);
    
    const commission = totalS * 0.03;
    const netIncome = totalS - (exp + transAmt + commission);

    const record = {
      id: Date.now(),
      date,
      totalW: totalW.toFixed(2),
      netIncome: netIncome.toFixed(0),
      transAmt: transAmt.toFixed(0),
      status: (document.getElementById('transStatus') as HTMLSelectElement)?.value || 'due'
    };

    this.history.unshift(record);
    localStorage.setItem('dadam_final_data', JSON.stringify(this.history));
    alert("હિસાબ સેવ થયો!");
    this.loadHistory();
  }

  loadHistory() {
    const data = localStorage.getItem('dadam_final_data');
    this.history = data ? JSON.parse(data) : [];
  }

  resetForm() {
    if (confirm("નવા વર્ષનો હિસાબ શરૂ કરવો છે? જૂનો ડેટા ભૂંસી જશે.")) {
      this.history = [];
      localStorage.removeItem('dadam_final_data');
    }
  }

  shareWhatsApp() {
    if (this.history.length === 0) return;
    const last = this.history[0];
    const msg = `*દાડમ હિસાબ*%0A📅 તારીખ: ${last.date}%0A⚖️ વજન: ${last.totalW}kg%0A💵 *ચોખ્ખી આવક: ₹${last.netIncome}*`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
