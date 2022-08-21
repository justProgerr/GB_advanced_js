class GoodsItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }

    render() {
        return `
        <div class="goods-item">
            <h3>${this.title}</h3>
            <p>${this.price}</p>
        </div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods= [];
    }

    fetchGoods() {
        this.goods = [
            { title: 'Shirt', price: 150 },
            { title: 'Socks', price: 50 },
            { title: 'Jacket', price: 350 },
            { title: 'Shoes', price: 250 },
        ]
    }

    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render();
        })
        document.querySelector('.goods-list').innerHTML = listHtml;
    }

    /**
     * 
     * @returns Возвращает общую сумму товаров.
     */
    getTotalSum() {
        if (!this.goods) {
            document.querySelector('.goods-list')
            .after('Не могу посчитать сумму, товаров нет.')
            return;
        }

        let totalSum = this.goods.reduce((sum, curr) => sum+=curr.price, 0);
        return document.querySelector('.goods-list')
        .after(`Итоговая сумма товаров составляет: ${totalSum}`);
    }
}

class BasketGoodsItem {
    /*
    constructor(title, price, count, total) {
        Наверно здесь можно наследоваться от класса GoodsItem свойства title и price
        остальные свойство будут только те, которые относятся к этому классу
        
    }
    */

    /*
        Думаю здесь должны быть следующие методы:

        render() -- Генерирует разметку html для одной позиции товара
    */
}

class BasketGoodsList {
    constructor() {
        this.basketList = []; // Здесь будет список добавленных в корзину товаров
    }

    /*
        Здесь должны быть слудующие методы:

        addGood() -- Добавляет товар в список товаров в корзине
        
        removeGood() -- Удаляет товар из корзины

        предыдущие два метода, должны при срабатывании сразу рассчитвыать итоговую сумму.

        render() -- Генерирует список товаров добавленных в корзину
        с подсчитанным колличеством и суммой
    */
}

let goodsList1 = new GoodsList();
goodsList1.fetchGoods();
goodsList1.render();
goodsList1.getTotalSum();