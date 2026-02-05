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
  mandiName: string = '';
  loadedCrates: number = 0;
  transRate: number = 0;
  gradingMode: string = 'mandi';

  rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  entryRows = this.rows.map(() => ({ w: null, p: null, t: '20' }));

  showSummary: boolean = false;
  totalWeight: string = '0';
  totalSales: string = '0';
  totalExpense: string = '0';
  mandiCharge: string = '0';
  netIncome: string = '0';
  averageRate: string = '0';

  constructor() {}

  ngOnInit() {}

  calculateBill() {
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
      this.showSummary = false;
      return;
    }

    const weightInMund = totalW / 20;
    const commission = totalS * 0.03;
    const gradingExp = this.gradingMode === 'mandi' ? (weightInMund * 13) : 0;
    const transAmt = Number(this.loadedCrates) * Number(this.transRate);
    const labourExp = weightInMund * 15;

    const totalExp = commission + gradingExp + transAmt + labourExp;
    const netInc = totalS - totalExp;

    this.totalWeight = totalW.toFixed(2);
    this.totalSales = totalS.toFixed(2);
    this.totalExpense = totalExp.toFixed(2);
    this.mandiCharge = commission.toFixed(2);
    this.netIncome = netInc.toFixed(0);
    this.averageRate = (netInc / totalW).toFixed(2);
    this.showSummary = true;
  }

  saveData() {
    if (!this.showSummary || Number(this.totalWeight) === 0) {
      alert("મહેરબાની કરીને પહેલા વિગતો ભરો!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: this.currentDate,
      driver: this.driverName || 'માહિતી નથી',
      mandi: this.mandiName || 'માહિતી નથી',
      totalW: this.totalWeight,
      net: this.netIncome,
      avg: this.averageRate
    };

    const history = JSON.parse(localStorage.getItem('dadam_history') || '[]');
    history.unshift(newEntry);
    localStorage.setItem('dadam_history', JSON.stringify(history));

    alert("હિસાબ ઇતિહાસમાં સેવ થઈ ગયો!");
    this.clearForm();
  }

  clearForm() {
    this.entryRows = this.rows.map(() => ({ w: null, p: null, t: '20' }));
    this.driverName = '';
    this.mandiName = '';
    this.loadedCrates = 0;
    this.transRate = 0;
    this.showSummary = false;
  }

  shareWhatsApp() {
    if (!this.showSummary) return;
    const msg = `*દાડમ મંડી હિસાબ*%0A📅 તારીખ: ${this.currentDate}%0A🏢 મંડી: ${this.mandiName}%0A⚖️ વજન: ${this.totalWeight} kg%0A💵 *ચોખ્ખી આવક: ₹${this.netIncome}*%0A📈 સરેરાશ: ₹${this.averageRate}/kg`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
