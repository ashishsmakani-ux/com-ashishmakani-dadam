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
  mandiName: string = ''; // મંડીનું નામ
  loadedCrates: number = 0;
  transRate: number = 0;
  gradingMode: string = 'mandi'; 

  rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  entryRows = this.rows.map(() => ({ w: null, p: null, t: '20' }));

  // સમરી ડિસ્પ્લે માટેના વેરીએબલ્સ
  showSummary: boolean = false;
  totalWeight: string = '0';
  totalSales: string = '0';
  totalExpense: string = '0';
  mandiCharge: string = '0';
  netIncome: string = '0';
  averageRate: string = '0';

  history: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadHistory();
  }

  // હિસાબ ગણવા માટેનું ફંક્શન
  calculateBill() {
    let totalW = 0;
    let totalS = 0;

    this.entryRows.forEach(row => {
      if (row.w && row.p) {
        let weight = Number(row.w);
        let price = Number(row.p);
        totalW += weight;
        // ૨૦ કિલો કે ૧ કિલો મુજબ ગણતરી
        if (row.t === '20') {
          totalS += (weight / 20) * price;
        } else {
          totalS += weight * price;
        }
      }
    });

    if (totalW === 0) {
      alert("મહેરબાની કરીને વજન અને ભાવ લખો!");
      return;
    }

    const weightInMund = totalW / 20;
    const gradingExp = this.gradingMode === 'mandi' ? (weightInMund * 13) : 0;
    const transAmt = this.loadedCrates * this.transRate;
    const commission = totalS * 0.03; // ૩% મંડી ચાર્જ
    
    const totalExp = gradingExp + transAmt + commission;
    const netInc = totalS - totalExp;

    // સમરી બોક્સમાં ડેટા બતાવવા માટે
    this.totalWeight = totalW.toFixed(2);
    this.totalSales = totalS.toFixed(2);
    this.totalExpense = totalExp.toFixed(2);
    this.mandiCharge = commission.toFixed(2);
    this.netIncome = netInc.toFixed(2);
    this.averageRate = (netInc / totalW).toFixed(2);
    
    this.showSummary = true;
  }

  saveData() {
    if (!this.showSummary) {
      this.calculateBill();
    }

    const newEntry = {
      id: Date.now(),
      date: this.currentDate,
      driver: this.driverName || 'માહિતી નથી',
      mandi: this.mandiName || 'માહિતી નથી',
      totalW: this.totalWeight,
      net: this.netIncome,
      avg: this.averageRate,
      gradingType: this.gradingMode === 'mandi' ? '🏢 મંડી' : '👨‍🌾 ખેડૂત',
      status: 'due'
    };

    this.history.unshift(newEntry);
    localStorage.setItem('dadam_final_data', JSON.stringify(this.history));
    alert("હિસાબ ટેબ ૨ માં સેવ થઈ ગયો!");
    this.clearForm();
  }

  loadHistory() {
    const data = localStorage.getItem('dadam_final_data');
    this.history = data ? JSON.parse(data) : [];
  }

  deleteData(id: number) {
    if (confirm("શું તમે આ હિસાબ ડિલીટ કરવા માંગો છો?")) {
      this.history = this.history.filter(item => item.id !== id);
      localStorage.setItem('dadam_final_data', JSON.stringify(this.history));
    }
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
    if (!this.showSummary && this.history.length === 0) return;
    
    const weight = this.showSummary ? this.totalWeight : this.history[0].totalW;
    const net = this.showSummary ? this.netIncome : this.history[0].net;
    const mandi = this.mandiName || (this.history[0] ? this.history[0].mandi : '-');

    const msg = `*દાડમ હિસાબ - આશિષ માકાણી*%0A📅 તારીખ: ${this.currentDate}%0A🏢 મંડી: ${mandi}%0A⚖️ કુલ વજન: ${weight} kg%0A💵 *ચોખ્ખી આવક: ₹${net}*`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
