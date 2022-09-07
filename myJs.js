const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    
    data: {
        catalogUrl: '/catalogData.json',
        cartUrl: '/getBasket.json',
        catalogProducts: [],
        cartProducts: [],
        filtered: [],
        searchLine: 'Чего хочу?',
        cartCount: 0,
        cartSum: 0,
        img: 'https://ic.pics.livejournal.com/obninskchess_ru/72180556/1313768/1313768_original.jpg',
    },

    methods: {
        getJson(url){
            return fetch(`${API_URL + url}` )
                .then(result => result.json())
                .catch(error => alert(`Данные с сервера не получены. Ошибка: ${error}`));
        },

        filter(event) {
            let regExp = new RegExp(event.target.value, 'i');

            this.filtered = this.catalogProducts.filter(item => regExp.test(item.product_name));
            this.catalogProducts.forEach(el => {
                let element = document.querySelector(`.catalog__item[data-id="${el.id_product}"`);

                if(!this.filtered.includes(el)) {
                    element.classList.add('hidden');
                } else {
                    element.classList.remove('hidden');
                }
            });
        },

        addProduct(event){
            let target = event.target;

            this.getJson('/addToBasket.json')
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartProducts.find(item => item.id_product === +target.dataset.id);
                        this.cartCount++;
                        this.cartSum += +target.dataset.price;
                        
                        if (find) {
                            find.quantity++;
                        } else {
                            let findCat = this.catalogProducts.find(item => item.id_product === +target.dataset.id);
                            let product = Object.assign({quantity: 1}, findCat);
                            this.cartProducts.push(product);
                        }
                    } else {
                        alert('error');
                    }
                })
        },

        remProduct(event) {
            let target = event.target;

            this.getJson('/deleteFromBasket.json')
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartProducts.find(item => item.id_product === +target.dataset.id);
                        this.cartCount--;
                        this.cartSum -= +target.dataset.price;

                        if (find.quantity > 1) {
                            find.quantity--;
                        } else {
                            this.cartProducts.splice(this.cartProducts.indexOf(find), 1);
                        }
                    } else {
                        alert('error');
                    }
                })
        },

        showCart() {
            document.querySelector('.cart')
                .classList
                .toggle('hidden');
        }
    },

    mounted() {
        this.getJson(this.catalogUrl)
            .then(data => {
                for (let item of data) {
                    this.catalogProducts.push(item);
                }
            });

        this.getJson(this.cartUrl)
            .then(data => {
                this.cartCount = data.countGoods;
                this.cartSum = +data.amount;

                for (let item of data.contents) {
                    this.cartProducts.push(item);
                }
            });

    }
})



