import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  // આ વેરીએબલ હોવું જરૂરી છે જેથી એરર ન આવે
  savedHistory: any[] = [];

  constructor() {}

  // જ્યારે પણ આ પેજ ખોલો ત્યારે નવો ડેટા લોડ થાય
  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    const data = localStorage.getItem('agri_records');
    // ડેટાને ઉંધા ક્રમમાં બતાવો જેથી લેટેસ્ટ હિસાબ ઉપર દેખાય
    this.savedHistory = data ? JSON.parse(data).reverse() : [];
  }

  // હિસાબ ડીલીટ કરવા માટે
  deleteItem(index: number) {
    let history = JSON.parse(localStorage.getItem('agri_records') || '[]');
    let realIndex = history.length - 1 - index;
    history.splice(realIndex, 1);
    localStorage.setItem('agri_records', JSON.stringify(history));
    this.loadData();
  }

  // જૂના હિસાબને ફરીથી WhatsApp પર શેર કરવા માટે
  shareAgain(item: any) {
    const text = `💰 *જૂનો ખેતીવાડી હિસાબ* 💰\n--------------------------\n📅 તારીખ: ${item.date}\n🏛️ મંડી: ${item.mandi}\n🚚 ગાડી: ${item.driver}\n--------------------------\n⚖️ વજન: ${item.totalWeight} kg\n💵 વેચાણ: ₹ ${item.totalSales}\n💰 *ચોખ્ખી આવક: ₹ ${item.netIncome}*\n--------------------------`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }
}
