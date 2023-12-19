
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

const addDataToHTML = () => {
    // thêm mới data
    if (products.length > 0) //if có data
    {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.discount ? 
                `<span class="originalPrice">$${product.price}</span> $${calculateDiscountedPrice(product.price, product.discount, 1)}` : `$${product.price}`}</div>
                <button class="view-details">Xem chi tiết</button>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
})

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
            <img src="${info.image}"></div>
            <div class="name"> ${info.name}</div>
            <div class="totalPrice">$${calculateDiscountedPrice(info.price, info.discount, item.quantity)}</div>
            <div class="quantity">
            <span class="minus"><</span>
            <span>${item.quantity}</span>
            <span class="plus">></span></div>`;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;

            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    // get data product
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            // get data cart from memory
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        })
}
initApp();


// Thêm id cho các phần tử
const searchBox = document.getElementById('searchInput');
const productList = document.getElementById('productList');

// Hàm tìm kiếm sản phẩm
const searchProducts = (query) => {
    const searchTerm = query.toLowerCase().trim();
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(query.toLowerCase());
    });

    if (filteredProducts.length > 0) {
        displayProducts(filteredProducts);
    } else {
        displayRecommendedProducts();
    }
};

// Sự kiện khi người dùng nhập vào ô tìm kiếm
searchBox.addEventListener('input', () => {
    const searchTerm = searchBox.value.trim();
    searchProducts(searchTerm);
});

// Hàm hiển thị sản phẩm
const displayProducts = (productArray) => {
    listProductHTML.innerHTML = ''; // Xóa danh sách sản phẩm hiện tại

    if (productArray.length > 0) {
        productArray.forEach(product => {
            // Tạo phần tử sản phẩm và thêm vào danh sách sản phẩm
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML =
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">${product.discount ? 
            `<span class="originalPrice">$${product.price}</span> $${calculateDiscountedPrice(product.price, product.discount, 1)}` : `$${product.price}`}</div>
            <button class="view-details">Xem chi tiết</button>
            <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    } else {
        // Hiển thị thông báo khi không tìm thấy sản phẩm
        let message = document.createElement('p');
        message.textContent = 'Không tìm thấy sản phẩm.';
        listProductHTML.appendChild(message);
    }
};

const orderButton = document.querySelector('.Order');
const orderSuccessDiv = document.getElementById('orderSuccess');

orderButton.addEventListener('click', () => {
    if (cart.length > 0) {
        // Hiển thị phần tử thông báo
        orderSuccessDiv.classList.remove('hidden', 'fadeOut');
        orderSuccessDiv.classList.add('show');

        // Cập nhật nội dung phần tử thông báo
        orderSuccessDiv.innerHTML = '<p>Đơn đặt hàng của bạn đã được gửi!</p>';

        // Xóa giỏ hàng
        cart = [];
        addCartToHTML();
        addCartToMemory();

        // Tự động ẩn thông báo sau một khoảng thời gian
        setTimeout(() => {
            orderSuccessDiv.classList.add('fadeOut');
        }, 3000); // 3000 milliseconds (3 seconds)
    } else {
        window.alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.');
    }
});
const displayRecommendedProducts = () => {
    listProductHTML.innerHTML = ''; // Xóa danh sách sản phẩm hiện tại

    if (recommendedProducts.length > 0) {
        recommendedProducts.forEach(product => {
            // Tạo phần tử sản phẩm và thêm vào danh sách sản phẩm
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="view-details">Xem chi tiết</button>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);

            // Thêm sự kiện lắng nghe cho nút "Add To Cart"
            newProduct.querySelector('.addCart').addEventListener('click', () => {
                addToCart(product.id);
            });
        });
    } else {
        // Hiển thị thông báo khi không có sản phẩm đề xuất
        let message = document.createElement('p');
        message.textContent = 'Không có sản phẩm đề xuất.';
        listProductHTML.appendChild(message);
    }
};
const recommendedProducts = [
    {
        "id": 9,
        "name": "Sản Phẩm Đề Xuất 1",
        "price": 150,
        "image": "image/cake1.png"
    },
    {
        "id": 10,
        "name": "Sản Phẩm Đề Xuất 2",
        "price": 180,
        "image": "image/cake1.png"
    },
    // Thêm sản phẩm đề xuất khác nếu cần
];

// Hàm tính giá cuối cùng sau ưu đãi
const calculateDiscountedPrice = (originalPrice, discountPercentage, quantity) => {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice * quantity;
};