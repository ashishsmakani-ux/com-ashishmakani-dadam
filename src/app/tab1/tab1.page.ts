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
  // તમારી ફાઇલ મુજબના શરૂઆતના ડેટા
  currentDate: string = new Date().toISOString().split('T')[0];
  driverName: string = '';
  loadedCrates: number = 0;
  transRate: number = 0;
  transType: string = 'perCrate';
  gradingMode: string = 'mandi';

  // ૧૦ લાઇન માટેની વ્યવસ્થા
  rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  entryRows = this.rows.map(() => ({ w: null, p: null, t: 20 }));

  history: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadHistory();
  }

  // હિસાબ કરવાની પદ્ધતિ (તમારી ફાઇલ મુજબ)
  saveData() {
    let totalW = 0;
    let totalS = 0;

    this.entryRows.forEach(row => {
      if (row.w && row.p) {
        totalW += Number(row.w);
        totalS += (Number(row.t) === 20) ? (Number(row.w) / 20 * Number(row.p)) : (Number(row.w) * Number(row.p));
      }
    });

    if (totalW === 0) {
      alert("મહેરબાની કરીને વજન અને ભાવ ભરો!");
      return;
    }

    const weightCrates = totalW / 20;
    const gradingExp = weightCrates * (this.gradingMode === 'mandi' ? 13 : 0);
    const labourExp = weightCrates * 15;
    const transAmt = (this.transType === 'perCrate') ? (this.loadedCrates * this.transRate) : this.transRate;
    const commission = totalS * 0.03;
    const totalExp = gradingExp + labourExp + transAmt + commission;
    const netIncome = totalS - totalExp;

    const newEntry = {
      id: Date.now(),
      date: this.currentDate,
      driver: this.driverName || 'માહિતી નથી',
      totalW: totalW.toFixed(2),
      net: netIncome.toFixed(0),
      lc: this.loadedCrates,
      trans: transAmt,
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
    if (confirm("શું તમે આ હિસાબ કાઢી નાખવા માંગો છો?")) {
      this.history = this.history.filter(item => item.id !== id);
      localStorage.setItem('dadam_final_data', JSON.stringify(this.history));
    }
  }

  resetForNewYear() {
    if (confirm("નવા વર્ષનો હિસાબ શરૂ કરવાથી જૂનો બધો ડેટા સાફ થઈ જશે. શું તમે સહમત છો?")) {
      this.history = [];
      localStorage.removeItem('dadam_final_data');
      alert("બધો ડેટા સાફ થઈ ગયો છે.");
    }
  }

  clearForm() {
    this.entryRows = this.rows.map(() => ({ w: null, p: null, t: 20 }));
    this.driverName = '';
    this.loadedCrates = 0;
    this.transRate = 0;
  }

  shareWhatsApp() {
    if (this.history.length === 0) return;
    const last = this.history[0];
    const msg = `*દાડમ હિસાબ - આશિષ માકાણી*%0A📅 તારીખ: ${last.date}%0A⚖️ વજન: ${last.totalW} kg%0A🚛 ભાડું: ₹${last.trans}%0A💵 *ચોખ્ખી આવક: ₹${last.net}*`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
