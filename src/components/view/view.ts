import { Plant } from '../../components/types';
import noUiSlider from 'nouislider';
import { target } from 'nouislider';
import { Controller } from '../controller/controller';

export class View {

  constructor() {
    this.focusOnSearch();
    this.createNoUISlider();
  }

  focusOnSearch(): void {
    const searchInput = document.querySelector<HTMLInputElement>('.search__input');
    if (searchInput) {
      searchInput.focus();
    }
  }

  createNoUISlider(): void {
    const sliderStock = document.querySelector<HTMLElement>('.filters__stock-slider');
    const sliderStockMin = 1;
    const sliderStockMax = 10;
    const sliderPrice = document.querySelector<HTMLElement>('.filters__price-slider');
    const sliderPriceMin = 20;
    const sliderPriceMax = 220;

    if (sliderStock && sliderPrice) {
      noUiSlider.create(sliderStock, {
        start: [sliderStockMin, sliderStockMax],
        connect: true,
        tooltips: true,
        format: {
          to: function (value) {
            return value.toFixed(0);
          },
          from: function (value) {
            return Number(value);
          },
        },
        behaviour: 'tap-drag',
        step: 1,
        range: {
          'min': sliderStockMin,
          'max': sliderStockMax,
        },
      });

      noUiSlider.create(sliderPrice, {
        start: [sliderPriceMin, sliderPriceMax],
        connect: true,
        tooltips: true,
        format: {
          to: function (value) {
            return value.toFixed(0);
          },
          from: function (value) {
            return Number(value);
          },
        },
        behaviour: 'tap-drag',
        step: 10,
        range: {
          'min': sliderPriceMin,
          'max': sliderPriceMax,
        },
      });
    }
  }

  setCardsNumber(plantsArray: Plant[]): void {
    const plantsCountContainer = document.querySelector<HTMLElement>('.count__span');
    if (plantsCountContainer) {
      plantsCountContainer.innerHTML = String(plantsArray.length);
    }
  }

  handleNoMatch(): void {
    const plantsContainer = document.querySelector<HTMLElement>('.items__cards');
    if (plantsContainer) {
      plantsContainer.textContent = 'No matches found :<';
    }
  }

  drawPlants(plantsArray: Plant[], controller: Controller): void {
    const plantsContainer = document.querySelector<HTMLElement>('.items__cards');
    if (plantsContainer) {

      plantsContainer.innerHTML = '';

      plantsArray.forEach((plant: Plant): void => {
        const plantCard: HTMLElement = document.createElement('div');
        plantCard.classList.add('items__card');
        plantCard.dataset.number = `${plant.num}`;
        if (controller.checkFavCards(plantCard.dataset.number)) {
          plantCard.classList.add('card--fav');
        }
        plantCard.innerHTML = `<img alt="plant photo" src="assets/plants/${plant.num}.png">
        <h3>${plant.name}</h3>
        <h3>$${plant.price}</h3>
        <p>in stock: ${plant.count}</p>
        <p>size: ${plant.size}</p>
        <p>pot color: ${plant.color}</p>
        <p>difficulty: ${plant.dif}</p>
        <p>pet friendly: ${plant.pet === true ? 'yes!' : 'no!'}</p>
        <button>
          <span class="material-symbols-outlined">
            shopping_cart
          </span>
        </button>`;

        plantsContainer.append(plantCard);
        plantCard.addEventListener('click', (event: Event) => { this.addToFav(event, controller); });
      });
    }
  }

  listenStock(controller: Controller): void {
    const stockSlider = document.querySelector<target>('.filters__stock-slider');

    if (stockSlider) {
      stockSlider.noUiSlider?.on('update', () => {
        const sliderMinValue = stockSlider.querySelector<HTMLElement>('.noUi-handle-lower');
        const sliderMaxValue = stockSlider.querySelector<HTMLElement>('.noUi-handle-upper');
        if (sliderMaxValue && sliderMinValue) {
          const min = Math.round(Number(sliderMinValue.ariaValueNow));
          const max = Math.round(Number(sliderMaxValue.ariaValueNow));
          const values: number[] = [min, max];
          controller.handleSliders('count', values);
        }
        controller.handleFilter();
      });
    }
  }

  listenPrice(controller: Controller): void {
    const priceSlider = document.querySelector<target>('.filters__price-slider');

    if (priceSlider) {
      priceSlider.noUiSlider?.on('update', () => {
        const sliderMinValue = priceSlider.querySelector<HTMLElement>('.noUi-handle-lower');
        const sliderMaxValue = priceSlider.querySelector<HTMLElement>('.noUi-handle-upper');
        if (sliderMaxValue && sliderMinValue) {
          const min = Math.round(Number(sliderMinValue.ariaValueNow));
          const max = Math.round(Number(sliderMaxValue.ariaValueNow));
          const values: number[] = [min, max];
          controller.handleSliders('price', values);
        }
        controller.handleFilter();
      });
    }
  }

  setSliders(stock: number[], price: number[]): void {
    const stockSlider = document.querySelector<target>('.filters__stock-slider');
    const priceSlider = document.querySelector<target>('.filters__price-slider');

    if (priceSlider && stockSlider) {
      priceSlider.noUiSlider?.set(price);
      stockSlider.noUiSlider?.set(stock);
    }
  }

  listenColor(controller: Controller): void {
    const colorBtns = document.querySelectorAll<HTMLElement>('.color__btn');

    colorBtns.forEach((btn: HTMLElement) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('btn--active');
        if (btn.dataset.filter) controller.handleButtons('color', btn.dataset.filter);
        controller.handleFilter();
      });
    });
  }

  listenSize(controller: Controller): void {
    const sizeBtns = document.querySelectorAll<HTMLElement>('.size__btn');

    sizeBtns.forEach((btn: HTMLElement) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('btn--active');
        if (btn.dataset.filter) controller.handleButtons('size', btn.dataset.filter);
        controller.handleFilter();
      });
    });
  }

  listenDiff(controller: Controller): void {
    const diffBtns = document.querySelectorAll<HTMLElement>('.diff__btn');

    diffBtns.forEach((btn: HTMLElement) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('btn--active');
        if (btn.dataset.filter) controller.handleButtons('dif', btn.dataset.filter);
        controller.handleFilter();
      });
    });
  }

  exportActiveBtns(): string[] {
    const btns = document.querySelectorAll<HTMLElement>('.btn--active');
    const dataArray: string[] = [];
    btns.forEach((btn) => {
      if (btn.dataset.filter) dataArray.push(btn.dataset.filter);
    });
    return dataArray;
  }

  activateBtns(array: string[]): void {
    const btns = document.querySelectorAll<HTMLElement>('.btn');
    btns.forEach((btn) => {
      if (btn.dataset.filter && array.includes(btn.dataset.filter)) {
        btn.classList.add('btn--active');
      }
    });
  }

  listenPet(controller: Controller): void {
    const petCheck = document.querySelector<HTMLInputElement>('.pet__label');

    if (petCheck) {
      petCheck.addEventListener('click', () => {
        controller.handleCheckBox();
        controller.handleFilter();
      });
    }
  }

  checkPet(): void {
    const petCheck = document.querySelector<HTMLInputElement>('.pet__input');
    if (petCheck) {
      petCheck.checked = true;
    }
  }

  listenResetFilters(controller: Controller): void {
    const resetFiltersBtn = document.getElementById('reset-filters');
    const petInput = document.querySelector<HTMLInputElement>('.pet__input');
    const stockSlider = document.querySelector<target>('.filters__stock-slider');
    const priceSlider = document.querySelector<target>('.filters__price-slider');
    const searchInput = document.querySelector<HTMLInputElement>('.search__input');

    if (resetFiltersBtn && petInput && priceSlider && stockSlider && searchInput) {
      resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        priceSlider.noUiSlider?.reset();
        stockSlider.noUiSlider?.reset();
        petInput.checked = false;
        const activeBtns = document.querySelectorAll<HTMLElement>('.btn--active');
        activeBtns.forEach((btn) => btn.classList.remove('btn--active'));

        controller.handleResetFilters();
        controller.handleFilter();
      });
    }
  }

  listenResetAllData(controller: Controller): void {
    const resetDataBtn = document.getElementById('reset-data');

    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {

        const favCards = document.querySelectorAll<HTMLElement>('.card--fav');
        const petInput = document.querySelector<HTMLInputElement>('.pet__input');
        const sortSelect = document.querySelector<HTMLSelectElement>('.sort__select');
        const activeBtns = document.querySelectorAll<HTMLElement>('.btn--active');
        const stockSlider = document.querySelector<target>('.filters__stock-slider');
        const priceSlider = document.querySelector<target>('.filters__price-slider');
        const modal = document.querySelector<HTMLElement>('.header__modal');
        const searchInput = document.querySelector<HTMLInputElement>('.search__input');

        controller.handleResetFilters();
        controller.handleResetFav();
        controller.handleResetSort();
        controller.handleFilter();
        this.focusOnSearch();

        if (stockSlider && priceSlider) {
          priceSlider.noUiSlider?.reset();
          stockSlider.noUiSlider?.reset();
        }
        if (petInput && sortSelect) {
          petInput.checked = false;
          sortSelect.value = 'none';
        }
        if (favCards) {
          favCards.forEach((card) => card.classList.remove('card--fav'));
          this.setFavCount(controller);
        }

        if (searchInput) {
          searchInput.value = '';
        }

        activeBtns.forEach((btn) => btn.classList.remove('btn--active'));
        if (modal) {
          modal.classList.remove('header__modal--active');
        }
      });
    }
  }

  listenSorting(controller: Controller): void {
    const sortSelect = document.querySelector<HTMLSelectElement>('.sort__select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (event: Event) => {
        if (event.target instanceof HTMLSelectElement) {
          if (event.target.value === 'none') {
            controller.handleResetSort();
          } else {
            const sortValues: string[] = event.target.value.split('-');
            controller.handleSort(sortValues);
          }
        }
      });
    }
  }

  setSortValue(sortValues: string[] | string): void {
    const sortSelect = document.querySelector<HTMLSelectElement>('.sort__select');
    if (sortSelect) {
      sortSelect.value = `${sortValues[0]}-${sortValues[1]}`;
    }
  }

  listenSearch(controller: Controller): void {
    const searchInput = document.querySelector<HTMLInputElement>('.search__input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const searchValue: string = searchInput.value.toLowerCase();
        controller.handleSearch(searchValue);
        controller.handleFilter();
      });
    }
  }

  setSearch(text: string): void {
    const searchInput = document.querySelector<HTMLInputElement>('.search__input');
    if (searchInput) {
      searchInput.value = text;
    }
  }

  addToFav(event: Event, controller: Controller): void {
    const modal = document.querySelector<HTMLElement>('.header__modal');

    if (modal) {

      if (Number(controller.returnFavCount()) >= 20) {

        if (event.target instanceof Element) {
          const card = event.target.parentElement;
          if (card && card.dataset.number && controller.checkFavCards(card.dataset.number)) {
            controller.handleFav(card.dataset.number);
            card.classList.remove('card--fav');
            modal.classList.remove('header__modal--active');
          } else {
            modal.classList.add('header__modal--active');
          }
        }

      } else {
        modal.classList.remove('header__modal--active');
        if (event.target instanceof Element) {
          const card = event.target.parentElement;
          if (card) {
            if (card.dataset.number) {
              controller.handleFav(card.dataset.number);
            }
            card.classList.toggle('card--fav');
          }
        }
      }
      this.setFavCount(controller);
    }
  }

  setFavCount(controller: Controller): void {
    const favCount = document.querySelector<HTMLElement>('.fav__count');
    if (favCount) {
      favCount.innerHTML = controller.returnFavCount();
    }
  }
}