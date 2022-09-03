const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Общий класс списка
class List {
    /**
     * 
     * @param {String} container - Селектор html элемента, в котором будет 
     * генерироваться список
     * 
     * @param {String} url - Путь к файлу json для текущего списка  
     * 
     * @param {Object} tiedClass - объект связей классов
     */
    constructor (container, url, tiedClass = tiedClasses) {
        this.container = container;
        this.url = url;
        this.tiedClass = tiedClass;
        this.allProducts = []; // массив объектов товаров в текущем списке
        this.goods = []; // массив товаров
        this._init(); // Не совсем понял почему именно так, но я ещё вернусь к этому месту
        this.filtered = []; // Здесь будут храниться товары, удовлетворяющие условия метода filter
    }

    /**
     * 
     * @param {String} url - путь к нужному json файлу
     * @param {Undefined} url - Если путь не указан то используется путь из 
     * свойства класса this.url
     * 
     * @returns 'json преобразованный в код javascript'
     */
    getJson(url) {
        return fetch(url || API_URL + this.url)
            .then(result => result.json());
    }

    /**
     * 
     * @param {*} data - ответ сервера. Массив или объект для распаковки. 
     */
    unpacking(data) {
        this.goods = [...data];
        this.render(); // После распаковки сразу генерируем список товаров
    }

    /**
     * Генерирует список товаров
     */
    render() {
        let blockEl = document.querySelector(this.container);

        this.goods.forEach(item => {
            let productObj = new this.tiedClass[this.constructor.name](item);
            this.allProducts.push(productObj);
            blockEl.insertAdjacentHTML('beforeend', productObj.render()); 
        })
    }

    /**
     * Фильтрация товаров
     * @param {*} value - Метод принимает строку, введённую в форму поиска.
     * обрабатывает строку и выводит в filtered продукты, удовлетворяющие 
     * условия метода
     */
    filter(value) {
        let regexp = new RegExp(value, 'i');
        this.filtered = this.allProducts.filter( product => regexp.test(product.product_name) );
        this.allProducts.forEach(el => {
            let element = document.querySelector(`.catalog__item[data-id="${el.product_id}"]`);
            if (!this.filtered.includes(el)) {
                element.classList.add('hidden');
            } else {
                element.classList.remove('hidden');
            }
        })
    }

    _init() {
        return false;
    }
}

// Класс списка каталога товаров. Наследуется от общего класса List
class CatalogList extends List {
    /**
     * 
     * @param {Object} cart - будет передаваться для класса списка каталога для 
     * запуска методов класса корзины 
     * @param {String} container - селектор контейнера, в котором будем 
     * генерировать список товаров каталога 
     * @param {String} url - относительный путь к файлу json со списком 
     * товаров в каталоге 
     */
    constructor(cart, container = '.catalog', url = '/catalogData.json') {
        super(container, url);
        this.cart = cart;
        this.getJson() // При создании корзины, сразу запускаем связь с сервером
                       // и распаковываем ответ
            .then(data => this.unpacking(data));
    }

    _init() { // вешаем обработчики событий для кнопки "купить"
        document.querySelector(this.container).addEventListener('click', ev => {
            if (ev.target.classList.contains('product__btn-buy')) {
                cart.addToCart(ev.target);
            }
        })

        document.querySelector('.header__search').addEventListener('search', (ev) => {
            ev.preventDefault();

            this.filter(ev.target.value);
        })

        // обработчик "Скрыть / показать корзину"
        document.getElementById('cartShow').addEventListener('click', ev => {
            ev.preventDefault();
            document.querySelector('.cart').classList.toggle('hidden');
        })
    }
}

// Класс списка товаров корзины. Наследуется от общего класса List
class CartList extends List {
    /**
     * 
     * @param {String} container - Селектор элемента контейнера, в котором 
     * будем рендерить список товаров корзины 
     * @param {String} url - Относительный путь к файлу json со списком 
     * товаров корзины 
     */
    constructor(container = '.cart__list', url = '/getBasket.json') {
        super(container, url);
        this.getJson()
            .then((data) => this.unpacking(data.contents))
            .catch(error => alert(error));
    }

    /**
     * Метод добавления товаров в корзину
     * @param {Element} btn - Принимаем саму кнопку, в которой есть 
     * информация об id, price, name товара
     */
    addToCart(btn) {
        this.getJson(`${API_URL}/addToBasket.json`)
            .then((data) => {
                if (data.result === 1){
                    let productId = +btn.dataset.id;
                    let find = this.allProducts.find(item => item.product_id === productId);
                    
                    if (find) {
                        find.quantity++;
                        this.updateCart(find);
                    } else {
                        let productObj = {
                            product_name: btn.dataset.name,
                            id_product: productId,
                            price: btn.dataset.price,
                            quantity: 1,
                        }

                        let productHtml = new this.tiedClass[this.constructor.name](productObj);
                        this.allProducts.push(productHtml);
                        document.querySelector(this.container).insertAdjacentHTML('beforeend', productHtml.render());
                    }
                    
                } else {
                    console.log('ошибка');
                }
            })
    }

    /**
     * метод удаления товара из корзины
     * @param {Element} btn - Принимаем кнопку, благодаря которой можно узнать 
     * id удаляемого товара 
     */
    remFromCart(btn) {
        this.getJson(`${API_URL}/deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1){
                    let productId = +btn.dataset.id;
                    let find = this.allProducts.find(item => item.product_id === productId);
                    
                    if (find.quantity > 1) {
                        find.quantity--;
                        this.updateCart(find);
                    } else {
                        this.allProducts.splice(find, 1);
                        find.quantity--;
                        document.querySelector(`.cart__item[data-id="${productId}"]`).remove();
                    }
                    
                } else {
                    console.log('ошибка');
                }
            })
    }

    /**
     * Метод обновления html после добавления или удаления товара из корзины
     * @param {Object} product - Принимаем объект товара, подвергшиегося 
     * изменению (Удаление / Добавление)
     */
    updateCart(product) {
        let cartList = document.querySelector(this.container);
        let targetEl = cartList.querySelector(`[data-id="${product.product_id}"]`);
        console.log(targetEl);
        targetEl.querySelector('.product__quantity').textContent = `Кол-во: ${product.quantity}`;
        targetEl.querySelector('.product__price-total').textContent = `${product.product_price * product.quantity} руб.`;
    }

    /**
     * Вешаем обработчики событий на кнопки + И - (добавить / удалить 
     * соответственно)
     */
    _init() {
        document.querySelector(this.container).addEventListener('click', ev => {
            if (ev.target.classList.contains('product__add')) {
                this.addToCart(ev.target);
            };

            if (ev.target.classList.contains('product__rem')) {
                this.remFromCart(ev.target);
            };
        });
    }
}

// Общий класс товара
class Product {
    /**
     * 
     * @param {Object} productObj - принимем объект товара, из которого будем 
     * брать свойства для генерации html
     * @param {String} img - картинка. Если нет картинки в ответе сервера, то 
     * используем адрес картинки в этом параметре
     */
    constructor(productObj, img = 'https://ic.pics.livejournal.com/obninskchess_ru/72180556/1313768/1313768_original.jpg') {
        this.product_name = productObj.product_name;
        this.product_id = productObj.id_product;
        this.product_price = productObj.price;
        this.img = img;
    }

    /**
     * 
     * @returns Возвращает разметку товара в HTML
     */
    render() {
        return `
            <li class="catalog__item product" data-id="${this.product_id}">
                <div class="product__img">
                <img src="${this.img}" alt="no photo">
                </div>

                <div class="product__bio">
                <h3 class="product__title">${this.product_name}</h3>
                <p class="product__price">Цена: ${this.product_price} руб</p>
                <button class="product__btn-buy" 
                    data-id="${this.product_id}" 
                    data-name="${this.product_name}"
                    data-price="${this.product_price}">купить</button>
                </div>
            </li>
        `;
    }
}

// Класс товара каталога. Наследуется от общего класса Product
// Если я правильно понял, этот класс можно оставить для гибкости. Чтобы если вдруг 
// В будущем, захочется изменить что то в отображении товара из каталога, то можно будет
// использовать этот класс
class CatalogProduct extends Product {

}

// Класс товара корзинки. Наследуется от общего класса Product
class CartProduct extends Product {
    /**
     * 
     * @param {Object} productObj - Принимаем объект товара для последющей 
     * генерации html элемента
     * @param {String} img - Картинка товара. Если не указана, то наследуется 
     * от super класса product
     */
    constructor (productObj, img) {
        super(productObj, img);
        this.quantity = productObj.quantity; // добавляем свойство "кол-во товаров"
    }

    /**
     * 
     * @returns генерируем html товара корзины для вставки в разметку
     */
    render() {
        return `
        <li class="cart__item product container--flex" data-id="${this.product_id}">
            <div class="product__img">
            <img src="https://ic.pics.livejournal.com/obninskchess_ru/72180556/1313768/1313768_original.jpg" alt="no photo">
            </div>
            <h3 class="product__title">${this.product_name}</h3>
            <p class="product__price">Цена за шт.: ${this.product_price} руб.</p>
            <p class="product__quantity">Кол-во: ${this.quantity}</p>
            <button class="cart__btn product__add"
                data-id="${this.product_id}">+</button>
            <button class="cart__btn product__rem"
                data-id="${this.product_id}">-</button>
            <span> = </span>
            <p class="product__price-total"> ${this.product_price} руб.</p>
        </li>
        `;
    }


}

// Связь классов. Даёт возможность обратиться к привязанному классу
let tiedClasses = {
    CatalogList: CatalogProduct,
    CartList: CartProduct
};

let cart = new CartList()
let catalogList = new CatalogList(cart);
