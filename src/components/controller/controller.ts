import { Model } from '../model/model';
import { View } from '../view/view';
import { Plant } from '../types';

export class Controller {
  model: Model;

  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
  }

  init(): void {
    this.getLocalStorage();
    this.turnOnFilters();
    this.view.drawPlants(this.model.plantsToDraw, this);
  }

  turnOnFilters(): void {
    this.view.listenStock(this);
    this.view.listenPrice(this);
    this.view.listenColor(this);
    this.view.listenSize(this);
    this.view.listenDiff(this);
    this.view.listenPet(this);
    this.view.listenResetFilters(this);
    this.view.listenSorting(this);
    this.view.listenSearch(this);
    this.view.listenResetAllData(this);
  }

  handleFilter(): void {
    this.model.filterPlants();

    const plantsToDraw: Plant[] = this.model.plantsToDraw;
    if (!plantsToDraw.length) {
      this.view.handleNoMatch();
    } else {
      this.view.drawPlants(plantsToDraw, this);
    }
    this.view.setCardsNumber(plantsToDraw);
    this.setLocalStorage();
  }

  handleSliders(property: 'count' | 'price', values: number[]): void {
    this.model.setCountPrice(property, values);
  }

  handleButtons(property: 'color' | 'size' | 'dif', value: string): void {
    this.model.setColorSizeDif(property, value);
  }

  handleCheckBox(): void {
    this.model.setPet();
  }

  handleSearch(searchValue: string): void {
    this.model.activeFilters.search = searchValue;
  }

  handleSort(sortValues: string[] | string): void {

    if ((sortValues[0] === 'name' || sortValues[0] === 'price') &&
      (sortValues[1] === 'asc' || sortValues[1] === 'desc')) {
      this.model.sortPlants(sortValues[0], sortValues[1]);
    }
    this.view.drawPlants(this.model.plantsToDraw, this);
    this.setLocalStorage();
  }

  handleResetSort(): void {
    this.model.resetSort();
    const plantsToDraw: Plant[] = this.model.plantsToDraw;
    this.view.drawPlants(plantsToDraw, this);
  }

  handleResetFilters(): void {
    this.model.resetFilters();
  }

  handleResetFav(): void {
    this.model.resetFav();
  }

  handleFav(plant: string): void {
    if (this.model.favPlants.includes(plant)) {
      this.model.removeFromFav(plant);
    } else {
      this.model.addToFav(plant);
    }
    localStorage.setItem('favs', JSON.stringify(this.model.favPlants));
  }

  returnFavCount(): string {
    return String(this.model.favPlants.length);
  }

  checkFavCards(plant: string): boolean {
    if (this.model.favPlants.length && this.model.favPlants.includes(plant)) return true;
    return false;
  }

  setLocalStorage(): void {
    localStorage.setItem('filters', JSON.stringify(this.model.activeFilters));
    localStorage.setItem('favs', JSON.stringify(this.model.favPlants));
    localStorage.setItem('btns', JSON.stringify(this.view.exportActiveBtns()));
  }

  getLocalStorage(): void {
    if (localStorage.getItem('filters')) {
      this.model.activeFilters = JSON.parse(localStorage.getItem('filters') as string);
      if (this.model.activeFilters.pet) {
        this.view.checkPet();
      }
      if (this.model.activeFilters.sort !== 'none') {
        this.view.setSortValue(this.model.activeFilters.sort);
      }
      if (this.model.activeFilters.count !== [1, 10] && this.model.activeFilters.count !== [20, 220]) {
        this.view.setSliders(this.model.activeFilters.count, this.model.activeFilters.price);
      }
      if (this.model.activeFilters.search) {
        this.view.setSearch(this.model.activeFilters.search);
      }
    }

    if (localStorage.getItem('favs')) {
      this.model.favPlants = JSON.parse(localStorage.getItem('favs') as string);
      this.view.setFavCount(this);
    }

    if (localStorage.getItem('btns')) {
      this.view.activateBtns(JSON.parse(localStorage.getItem('btns') as string));
    }
  }
}