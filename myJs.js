const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class CatalogItem {
    constructor(goodId, title = 'Наименование товара', price = 'Стоимость уточняйте на сайте') {
        this.goodId = goodId;
        this.title = title;
        this.price = price;
    }

    render() {
        return `
            <div class="catalog__item" data-good-id ='${this.goodId}' >
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <button> Купить </button>
            </div>
        `;
    }
}

class CatalogList {
    constructor() {
        this.goods = null;
        this.container = document.querySelector('.catalog__list');
    }

    fetchGoods() {
        return fetch(`${API_URL}/catalogData.json`)
            .then( response => response.json() )
            .then( goods => this.goods = goods);
    }

    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new CatalogItem(good.id_product, good.product_name, good.price);
            listHtml += goodItem.render();
        })
        this.container.innerHTML = listHtml;
    }

    getTotalSum() {
        if (!this.goods) {
            document.querySelector('.goods-list')
            .after('Товаров нет.')
            return;
        }

        let totalSum = this.goods.reduce((sum, curr) => sum+=curr.price, 0);
        return document.querySelector('.goods-list')
        .after(`Итоговая сумма товаров составляет: ${totalSum}`);
    }
}

class CartItem {
    constructor(goodId, title, quantity, price) {
        this.goodId = goodId;
        this.title = title;
        this.quantity = quantity;
        this.price = price; 
    }
    
    render() {
        return `
            <tr class="cart__item" data-good-id='${this.goodId}'>
                <td class="cart__title">${this.title}</td>
                <td class="cart__price">${this.price}</td>
                <td class="cart__quantity">${this.quantity} </td>
                <td class="cart__total-price">${this.price * this.quantity}</td>
                <td><button>+</button></td>
                <td><button>-</button></td>
            </tr>
        `;
    }
}

class CartList {
    constructor() {
        this.goodList = null;
        this.amount = 0;
        this.countGoods = 0;
        this.container = document.querySelector('.cart__list');
    }

    getCart() {
        return fetch(`${API_URL}/getBasket.json`)
            .then( result => result.json() )
            .then( goods => {
                this.amount = goods.amount;
                this.countGoods = goods.countGoods;
                this.goodList = goods.contents;
            });
    }
    
    addGood() {

    }

    removeGood() {

    }

    render() {
        let table = document.createElement('table');
        let caption = `
            <tr>
                <th>Наименование</th>
                <th>Цена за шт.</th>
                <th>Шт.</th>
                <th>Общая цена</th>
                <th>Добавить</th>
                <th>Убрать</th>
            </tr>
        `;
        table.innerHTML = (caption);
        this.container.innerHTML = '';
        
        this.goodList.forEach(good => {
            let tr = new CartItem(good.id_product, good.product_name, good.quantity, good.price);
            table.insertAdjacentHTML('beforeend', tr.render());
        });

        let totals = `
            <p>
                Всего товаров в корзине: ${this.countGoods}:
            </p>
            <p>
                Общая сумма: ${this.amount}.
            </p>
        `;

        this.container.append(table);
        table.insertAdjacentHTML('afterend', totals);
    }
}

let catalogList = new CatalogList();
let cart = new CartList();

catalogList.fetchGoods()
    .then(() => catalogList.render());

cart.getCart()
.then(() => cart.render());
    



// goodsList1.render();
// goodsList1.getTotalSum();