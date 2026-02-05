import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  savedHistory: any[] = [];
  constructor() {}
  ionViewWillEnter() { this.loadData(); }
  loadData() {
    const data = localStorage.getItem('agri_records');
    this.savedHistory = data ? JSON.parse(data).reverse() : [];
  }
  deleteItem(index: number) {
    let history = JSON.parse(localStorage.getItem('agri_records') || '[]');
    history.splice(history.length - 1 - index, 1);
    localStorage.setItem('agri_records', JSON.stringify(history));
    this.loadData();
  }
}
