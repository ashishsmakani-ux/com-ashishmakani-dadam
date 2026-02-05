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
  
  // એન્ટ્રી માટે ૧૦ લાઈન
  entryRows: any[] = Array(10).fill(null).map(() => ({ w: null, p: null, t: '20' }));
  
  totalWeight: number = 0;
  totalSales: number = 0;
  totalExpense: number = 0;
  mandiTax: number = 0;
  netIncome: number = 0;
  averageRate: number = 0;
  showSummary: boolean = false;

  constructor() {}

  // બધામાં એકસાથે ૨૦ કિલો કરવા માટે
  setAllTo20() {
    this.entryRows.forEach(row => row.t = '20');
    this.calculateBill();
  }

  // બધામાં એકસાથે ૧ કિલો કરવા માટે
  setAllTo1() {
    this.entryRows.forEach(row => row.t = '1');
    this.calculateBill();
  }

  calculateBill() {
    this.totalWeight = 0;
    this.totalSales = 0;

    this.entryRows.forEach(row => {
      if (row.w && row.p) {
        this.totalWeight += Number(row.w);
        let rowTotal = (row.t === '20') ? (row.w * row.p / 20) : (row.w * row.p);
        this.totalSales += rowTotal;
      }
    });

    // ગ્રેડિંગ ચાર્જ: જો મંડી ગ્રેડિંગ હોય તો કેરેટ દીઠ ૧૩ રૂપિયા
    let gradingCharge = this.gradingMode === 'mandi' ? (Number(this.loadedCrates || 0) * 13) : 0;
    this.totalExpense = (Number(this.loadedCrates || 0) * Number(this.transRate || 0)) + gradingCharge;
    
    // મંડી ટેક્સ ૩%
    this.mandiTax = (this.totalSales * 3) / 100;
    this.netIncome = this.totalSales - this.totalExpense - this.mandiTax;
    this.averageRate = this.totalWeight > 0 ? (this.totalSales / this.totalWeight) : 0;
    this.showSummary = this.totalSales > 0;
  }

  saveData() {
    if (this.totalSales <= 0) return;
    const record = {
      date: this.currentDate,
      driver: this.driverName || 'અજ્ઞાત',
      mandi: this.mandiName || 'અજ્ઞાત',
      totalWeight: this.totalWeight.toFixed(2),
      totalSales: this.totalSales.toFixed(2),
      netIncome: this.netIncome.toFixed(2)
    };

    let history = JSON.parse(localStorage.getItem('agri_records') || '[]');
    history.push(record);
    localStorage.setItem('agri_records', JSON.stringify(history));
    alert('હિસાબ સેવ થઈ ગયો છે!');
  }

  shareWhatsApp() {
    const text = `🍎 *આશિષ માકાણી - ખેતીવાડી* 🍎\n--------------------------\n📅 તારીખ: ${this.currentDate}\n🚚 ગાડી: ${this.driverName}\n🏛️ મંડી: ${this.mandiName}\n--------------------------\n⚖️ વજન: ${this.totalWeight.toFixed(2)} kg\n💸 વેચાણ: ₹ ${this.totalSales.toFixed(2)}\n🚜 ખર્ચ: ₹ ${(this.totalExpense + this.mandiTax).toFixed(2)}\n--------------------------\n💰 *ચોખ્ખી આવક: ₹ ${this.netIncome.toFixed(2)}*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }
}
