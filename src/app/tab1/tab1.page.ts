import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  currentDate: string = new Date().toISOString().split('T')[0];
  driverName: string = '';
  mandiName: string = '';
  gradingMode: string = 'mandi';
  loadedCrates: number = 0;
  transRate: number = 0;
  
  entryRows: any[] = Array(10).fill(null).map(() => ({ w: null, p: null, t: '20' }));
  
  totalWeight: number = 0;
  totalSales: number = 0;
  totalExpense: number = 0;
  mandiTax: number = 0;
  netIncome: number = 0;
  averageRate: number = 0;
  showSummary: boolean = false;

  constructor() {}

  setAllTo20() { this.entryRows.forEach(r => r.t = '20'); this.calculateBill(); }
  setAllTo1() { this.entryRows.forEach(r => r.t = '1'); this.calculateBill(); }

  calculateBill() {
    this.totalWeight = 0; this.totalSales = 0;
    this.entryRows.forEach(row => {
      if (row.w && row.p) {
        this.totalWeight += Number(row.w);
        this.totalSales += (row.t === '20') ? (row.w * row.p / 20) : (row.w * row.p);
      }
    });
    let gradingCharge = this.gradingMode === 'mandi' ? (this.loadedCrates * 13) : 0;
    this.totalExpense = (this.loadedCrates * this.transRate) + gradingCharge;
    this.mandiTax = (this.totalSales * 3) / 100;
    this.netIncome = this.totalSales - this.totalExpense - this.mandiTax;
    this.averageRate = this.totalWeight > 0 ? (this.totalSales / this.totalWeight) : 0;
    this.showSummary = this.totalSales > 0;
  }

  saveData() {
    if (this.totalSales <= 0) return;
    const record = {
      date: this.currentDate, driver: this.driverName || 'અજ્ઞાત', mandi: this.mandiName || 'અજ્ઞાત',
      totalWeight: this.totalWeight.toFixed(2), netIncome: this.netIncome.toFixed(2)
    };
    let history = JSON.parse(localStorage.getItem('agri_records') || '[]');
    history.push(record);
    localStorage.setItem('agri_records', JSON.stringify(history));
    alert('સેવ થઈ ગયું!');
  }

  shareWhatsApp() {
    const text = `🍎 *આશિષ માકાણી* 🍎\n📅 તારીખ: ${this.currentDate}\n🚚 ગાડી: ${this.driverName}\n⚖️ વજન: ${this.totalWeight.toFixed(2)}kg\n💰 *ચોખ્ખી આવક: ₹ ${this.netIncome.toFixed(2)}*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }
}
