document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://fakestoreapi.com/products';
  let products = [];
  let filteredProducts = [];
  let currentPage = 1;
  const productsPerPage = 4;

  const productContainer = document.getElementById('product-list');
  const cartItemsContainer = document.getElementById('cart-items');
  const totalQuantityElement = document.getElementById('total-quantity');
  const totalPriceElement = document.getElementById('total-price');
  const pageInfo = document.getElementById('page-info');

  const searchBox = document.getElementById('search-box');
  const categoryFilter = document.getElementById('category-filter');
  const minPrice = document.getElementById('min-price');
  const maxPrice = document.getElementById('max-price');
  const applyFilters = document.getElementById('apply-filters');

  let cart = [];

  const fetchProducts = async () => {
    const response = await fetch(apiUrl);
    // console.log(products);
    products = await response.json();
    console.log(products);
    filteredProducts = products;
    displayCategories();
    displayProducts();
    displayPagination();
  };

  const displayCategories = () => {
    const categories = ['all', ...new Set(products.map(product => product.category))];
    categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
  };

  const displayProducts = () => {
    productContainer.innerHTML = '';
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    currentProducts.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');
      productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button class="view-details">View Details</button>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            `;
      productContainer.appendChild(productElement);
    });

    pageInfo.innerText = `Page ${currentPage} of ${Math.ceil(filteredProducts.length / productsPerPage)}`;
  };

  const displayPagination = () => {
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === Math.ceil(filteredProducts.length / productsPerPage);
  };

  const applyFilter = () => {
    const searchValue = searchBox.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const minPriceValue = parseFloat(minPrice.value) || 0;
    const maxPriceValue = parseFloat(maxPrice.value) || Infinity;

    filteredProducts = products.filter(product => {
      return (
        product.title.toLowerCase().includes(searchValue) &&
        (categoryValue === 'all' || product.category === categoryValue) &&
        product.price >= minPriceValue &&
        product.price <= maxPriceValue
      );
    });

    currentPage = 1;
    displayProducts();
    displayPagination();
  };

  document.getElementById('prev-page').addEventListener('click', () => {
    currentPage--;
    displayProducts();
    displayPagination();
  });

  document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    displayProducts();
    displayPagination();
  });

  applyFilters.addEventListener('click', applyFilter);

  fetchProducts();

  window.addToCart = (id) => {
    const product = products.find(product => product.id === id);
    cart.push(product);
    updateCart();
  };

  window.removeFromCart = (id) => {
    cart = cart.filter(product => product.id !== id);
    updateCart();
  };

  const updateCart = () => {
    cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                ${item.title} - $${item.price}
                <button onclick="removeFromCart(${item.id})">Delete</button>
            </div>
        `).join('');
    totalQuantityElement.innerText = cart.length;
    totalPriceElement.innerText = cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };
});
