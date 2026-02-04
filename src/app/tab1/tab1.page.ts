
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  history: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadHistory();
  }

  // હિસાબ કરવાની અને સેવ કરવાની મેથડ
  saveData() {
    const date = (document.getElementById('date') as HTMLInputElement).value;
    const trans = Number((document.getElementById('trans') as HTMLInputElement).value) || 0;
    const lc = Number((document.getElementById('lc') as HTMLInputElement).value) || 0;
    const labour = Number((document.getElementById('labour') as HTMLInputElement).value) || 0;
    const weight = Number((document.getElementById('weight') as HTMLInputElement).value) || 0;
    const rate = Number((document.getElementById('rate') as HTMLInputElement).value) || 0;
    const commPer = Number((document.getElementById('comm') as HTMLInputElement).value) || 0;

    if (!date || !weight || !rate) {
      alert("મહેરબાની કરીને તારીખ, વજન અને ભાવ ભરો.");
      return;
    }

    // ગણતરી (તમારી ફાઇલ મુજબ)
    const totalIncome = weight * rate;
    const commAmount = (totalIncome * commPer) / 100;
    const totalLabour = lc * labour;
    const marketFees = (totalIncome * 0.5) / 100; // 0.5% માર્કેટ ફી
    const totalExpense = trans + totalLabour + commAmount + marketFees;
    const netIncome = totalIncome - totalExpense;

    const entry = {
      id: Date.now(),
      date, trans, lc, labour, weight, rate, 
      commAmount, totalIncome, totalExpense, netIncome,
      status: 'due'
    };

    this.history.unshift(entry);
    localStorage.setItem('dadam_data', JSON.stringify(this.history));
    this.loadHistory();
    alert("હિસાબ સેવ થઈ ગયો છે!");
  }

  loadHistory() {
    const data = localStorage.getItem('dadam_data');
    this.history = data ? JSON.parse(data) : [];
    this.updateHistoryUI();
  }

  updateHistoryUI() {
    const list = document.getElementById('history-list');
    if (!list) return;

    if (this.history.length === 0) {
      list.innerHTML = '<p style="text-align:center;">કોઈ જૂનો હિસાબ નથી.</p>';
      return;
    }

    let html = '';
    this.history.forEach((item) => {
      html += `
        <ion-item-sliding>
          <ion-item>
            <ion-label>
              <h3>📅 ${item.date} | 💰 ચોખ્ખી આવક: ₹${item.netIncome.toFixed(0)}</h3>
              <p>વજન: ${item.weight}kg | ભાવ: ₹${item.rate} | ખર્ચ: ₹${item.totalExpense.toFixed(0)}</p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" onclick="window.dispatchEvent(new CustomEvent('delete-entry', {detail: ${item.id}}))">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      `;
    });
    list.innerHTML = html;
  }

  // નવા વર્ષ માટે બધો ડેટા સાફ કરવા
  resetForm() {
    if (confirm("શું તમે ખરેખર નવા વર્ષનો હિસાબ શરૂ કરવા માંગો છો? જૂનો બધો ડેટા ભૂંસી નાખવામાં આવશે.")) {
      this.history = [];
      localStorage.removeItem('dadam_data');
      this.loadHistory();
    }
  }

  // WhatsApp પર હિસાબ મોકલવા
  shareWhatsApp() {
    if (this.history.length === 0) return;
    const last = this.history[0];
    const msg = `*દાડમ હિસાબ - આશિષ માકાણી*%0A📅 તારીખ: ${last.date}%0A⚖️ વજન: ${last.weight} kg%0A💸 ભાવ: ₹${last.rate}%0A🚛 ભાડું: ₹${last.trans}%0A💵 *ચોખ્ખી આવક: ₹${last.netIncome.toFixed(0)}*`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
