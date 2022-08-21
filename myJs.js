const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];

const renderGoodsItem = (title = 'Товар', price = 'Цена') => {
    return `
        <div class="goods-item">
            <h3>${title}</h3>
            <p>${price}</p>
        </div>`;
};

const renderGoodsList = (list) => {
let goodsList = list
    .map(( {title, price} = item ) => renderGoodsItem(title, price))
    .join('');   // ! Избавляемся от запятых

document.querySelector('.goods-list').innerHTML = goodsList;
}
renderGoodsList(goods);
    
/*
 -- Ответ на вопрос из 3-го задания. --
  Когда мы передаём список товаров goodsList в div.goods-list, он преобразуется
из массива в строку. Массив, изначально использует "," запятые в качестве разделителя. 
При динамическом преобразовании массива в строку, он перезаписывается так как есть, 
то есть, вместе с запятыми.

  Для того чтобы исправить это, мы можем явно преобразовать массив в строку при помощи
метода массивов "join()". Применим этот метод с указанием пустоты в 
качестве разделителя. 
*/