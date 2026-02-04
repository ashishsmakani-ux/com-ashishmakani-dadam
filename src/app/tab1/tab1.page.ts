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
  currentDate: string = new Date().toISOString().split('T')[0];
  driverName: string = '';
  loadedCrates: number = 0;
  transRate: number = 0;
  gradingMode: string = 'mandi'; // ડિફોલ્ટ મંડી

  rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  entryRows = this.rows.map(() => ({ w: null, p: null, t: '20' }));

  history: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadHistory();
  }

  saveData() {
    let totalW = 0;
    let totalS = 0;

    this.entryRows.forEach(row => {
      if (row.w && row.p) {
        let weight = Number(row.w);
        let price = Number(row.p);
        totalW += weight;
        if (row.t === '20') {
          totalS += (weight / 20) * price;
        } else {
          totalS += weight * price;
        }
      }
    });

    if (totalW === 0) {
      alert("માહિતી અધૂરી છે!");
      return;
    }

    const weightInMund = totalW / 20;
    // ગ્રેડિંગ ખર્ચ: મંડી હોય તો ₹13, ખેડૂત હોય તો ₹0
    const gradingExp = this.gradingMode === 'mandi' ? (weightInMund * 13) : 0;
    const labourExp = weightInMund * 15; // મજૂરી ₹15
    const transAmt = this.loadedCrates * this.transRate;
    const commission = totalS * 0.03; // ૩% કમિશન
    
    const totalExp = gradingExp + labourExp + transAmt + commission;
    const netIncome = totalS - totalExp;

    const newEntry = {
      id: Date.now(),
      date: this.currentDate,
      driver: this.driverName || 'માહિતી નથી',
      totalW: totalW.toFixed(2),
      net: netIncome.toFixed(0),
      lc: this.loadedCrates,
      gradingType: this.gradingMode === 'mandi' ? '🏢 મંડી' : '👨‍🌾 ખેડૂત',
      status: 'due'
    };

    this.history.unshift(newEntry);
    localStorage.setItem('dadam_final_data', JSON.stringify(this.history));
    alert("હિસાબ સેવ થઈ ગયો!");
    this.clearForm();
  }

  loadHistory() {
    const data = localStorage.getItem('dadam_final_data');
    this.history = data ? JSON.parse(data) : [];
  }

  deleteData(id: number) {
    if (confirm("ડિલીટ કરવા માંગો છો?")) {
      this.history = this.history.filter(item => item.id !== id);
      localStorage.setItem('dadam_final_data', JSON.stringify(this.history));
    }
  }

  resetForNewYear() {
    if (confirm("બધો ડેટા સાફ થઈ જશે?")) {
      this.history = [];
      localStorage.removeItem('dadam_final_data');
    }
  }

  clearForm() {
    this.entryRows = this.rows.map(() => ({ w: null, p: null, t: '20' }));
    this.driverName = '';
    this.loadedCrates = 0;
    this.transRate = 0;
  }

  shareWhatsApp() {
    if (this.history.length === 0) return;
    const last = this.history[0];
    const msg = `*દાડમ હિસાબ - આશિષ માકાણી*%0A📅 તારીખ: ${last.date}%0A⚖️ વજન: ${last.totalW} kg%0A💵 *ચોખ્ખી આવક: ₹${last.net}*`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
