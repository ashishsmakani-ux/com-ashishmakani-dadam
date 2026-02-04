
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  history: any[] = [];
  rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // તમારી ફાઇલ મુજબ ૧૦ રો

  constructor() {}

  ngOnInit() {
    this.loadHistory();
  }

  // ગણતરી અને સેવ કરવાની મેથડ
  saveData() {
    let totalW = 0, totalS = 0;
    const date = (document.getElementById('date') as HTMLInputElement).value;
    const driver = (document.getElementById('driverName') as HTMLInputElement).value || "માહિતી નથી";
    const loadedCrates = Number((document.getElementById('loadedCrates') as HTMLInputElement).value) || 0;
    const transRate = Number((document.getElementById('transRate') as HTMLInputElement).value) || 0;
    const transType = (document.getElementById('transType') as HTMLSelectElement).value;
    const gradingMode = (document.getElementById('gradingMode') as HTMLSelectElement).value;

    // ૧૦ લાઇનનો હિસાબ
    for (let i = 1; i <= 10; i++) {
      const w = Number((document.getElementById(`w${i}`) as HTMLInputElement).value) || 0;
      const p = Number((document.getElementById(`p${i}`) as HTMLInputElement).value) || 0;
      const type = Number((document.getElementById(`t${i}`) as HTMLSelectElement).value);
      totalW += w;
      totalS += (type === 20 ? (w / 20) * p : w * p);
    }

    if (totalW === 0 || !date) {
      alert("તારીખ, વજન અને ભાવ લખો!");
      return;
    }

    // તમારી ફાઇલ મુજબના ખર્ચ
    const weightCrates = totalW / 20;
    const exp = weightCrates * ((gradingMode === 'mandi' ? 13 : 0) + 15);
    const transAmt = (transType === 'perCrate' ? loadedCrates * transRate : transRate);
    const commission = totalS * 0.03;
    const netIncome = totalS - (exp + transAmt + commission);

    const record = {
      id: Date.now(),
      date,
      driver,
      totalW: totalW.toFixed(2),
      totalS: totalS.toFixed(2),
      transAmt: transAmt.toFixed(2),
      netIncome: netIncome.toFixed(2),
      lc: loadedCrates,
      status: (document.getElementById('transStatus') as HTMLSelectElement).value
    };

    this.history.unshift(record);
    localStorage.setItem('dadam_final_data', JSON.stringify(this.history));
    alert("હિસાબ સેવ થઈ ગયો!");
    this.loadHistory();
  }

  loadHistory() {
    const data = localStorage.getItem('dadam_final_data');
    this.history = data ? JSON.parse(data) : [];
  }

  deleteEntry(id: number) {
    if(confirm("શું તમે આ હિસાબ ડિલીટ કરવા માંગો છો?")) {
      this.history = this.history.filter(item => item.id !== id);
      localStorage.setItem('dadam_final_data', JSON.stringify(this.history));
    }
  }

  resetForm() {
    if (confirm("નવા વર્ષનો હિસાબ શરૂ કરવાથી જૂનો બધો ડેટા ભૂંસી જશે. શું તમે સહમત છો?")) {
      this.history = [];
      localStorage.removeItem('dadam_final_data');
    }
  }

  shareWhatsApp() {
    if (this.history.length === 0) return;
    const last = this.history[0];
    const msg = `*દાડમ હિસાબ - આશિષ માકાણી*%0A📅 તારીખ: ${last.date}%0A⚖️ વજન: ${last.totalW} kg%0A🚛 ભાડું: ₹${last.transAmt}%0A✨ *ચોખ્ખી આવક: ₹${last.netIncome}*`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
