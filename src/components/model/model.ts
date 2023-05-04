import { Plant } from '../types';
import { ActiveFilters } from '../types';

export class Model {
  plants: Plant[];

  plantsToDraw: Plant[];

  activeFilters: ActiveFilters;

  initFilters: ActiveFilters;

  favPlants: string[];

  constructor(plants: Plant[]) {
    this.plants = plants;
    this.plantsToDraw = this.plants;
    this.initFilters = {
      name: [],
      count: [1, 10],
      price: [20, 220],
      size: [],
      color: [],
      dif: [],
      pet: false,
      search: '',
      sort: 'none',
    };
    this.activeFilters = JSON.parse(JSON.stringify(this.initFilters));
    this.favPlants = [];
  }

  filterPlants(): void {
    this.plantsToDraw = this.plants.filter((plant: Plant) => {
      return (
        (!this.activeFilters.color.length || this.activeFilters.color.includes(plant.color.toLowerCase())) &&
        (!this.activeFilters.size.length || this.activeFilters.size.includes(plant.size.toLowerCase())) &&
        (!this.activeFilters.dif.length || this.activeFilters.dif.includes(plant.dif)) &&
        (!this.activeFilters.pet || plant.pet === this.activeFilters.pet) &&
        (!this.activeFilters.count.length || (plant.count >= this.activeFilters.count[0] && plant.count <= this.activeFilters.count[1])) &&
        (!this.activeFilters.price.length || (plant.price >= this.activeFilters.price[0] && plant.price <= this.activeFilters.price[1])) &&
        (!this.activeFilters.search.length || plant.name.toLowerCase().includes(this.activeFilters.search))
      );
    });
    if ((this.activeFilters.sort[1] === 'asc' || this.activeFilters.sort[1] === 'desc') &&
      (this.activeFilters.sort[0] === 'name' || this.activeFilters.sort[0] === 'price')) {
      this.sortPlants(this.activeFilters.sort[0], this.activeFilters.sort[1]);
    }
  }

  sortPlants(value: 'name' | 'price', order: 'asc' | 'desc'): void {
    if (order === 'asc') {
      this.plantsToDraw = this.plantsToDraw.sort(
        (firstCard: Plant, secondCard: Plant) => firstCard[value] < secondCard[value] ? -1 : 1);
    } else if (order === 'desc') {
      this.plantsToDraw = this.plantsToDraw.sort(
        (firstCard: Plant, secondCard: Plant) => firstCard[value] > secondCard[value] ? -1 : 1);
    }
    this.activeFilters.sort = [value, order];
  }

  resetSort(): void {
    this.activeFilters.sort = 'none';
    this.plantsToDraw.sort(
      (firstPlant: Plant, secondPlant: Plant) => firstPlant.num < secondPlant.num ? -1 : 1);
  }

  setCountPrice(property: 'count' | 'price', values: number[]): void {
    this.activeFilters[property] = [];
    values.forEach(value => this.activeFilters[property].push(value));
  }

  setColorSizeDif(property: 'color' | 'size' | 'dif', value: string): void {
    if (this.activeFilters[property].includes(value)) {
      this.activeFilters[property] = this.activeFilters[property].filter(elem => elem !== value);
    } else {
      this.activeFilters[property].push(value);
    }
    console.log(this.activeFilters.color);
    console.log(this.initFilters.color);
  }

  setPet(): void {
    if (this.activeFilters.pet === false) {
      this.activeFilters.pet = true;
    } else {
      this.activeFilters.pet = false;
    }
  }

  resetFilters(): void {
    this.activeFilters = JSON.parse(JSON.stringify(this.initFilters));
  }

  resetFav(): void {
    this.favPlants = [];
  }

  addToFav(value: string): void {
    this.favPlants.push(value);
  }

  removeFromFav(value: string): void {
    this.favPlants = this.favPlants.filter(elem => elem !== value);
  }
}