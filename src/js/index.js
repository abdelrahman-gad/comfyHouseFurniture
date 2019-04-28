/**
 * @description external api provied demo data for testing or populating the UI
 * @name client
 * @global
 * @constant
 *
 *
 */

const client = contentful.createClient({
  space: "tzsry6lrietp",
  accessToken:
    "45db9d587d237f603aa7bfddb35918bb377e6505f129200c9c1e07968be1c628",
  host: "512063bb41145bfc98748478968f3fae74b98d9fa305d00c3920a669599985e0"
});
// console.log(client);

// variables
/**
 * @description  assigning div.cart-btn DOM to cartBtn object
 * @name cartBtn
 * @constant
 * @global
 * @type {Object}
 */
const cartBtn = document.querySelector(".cart-btn");
/**
 * @description  assigning  div.close-cart DOM to closeCartBtn object
 * @name closeCartBtn
 * @constant
 * @global
 * @type {Object}
 */
const closeCartBtn = document.querySelector(".close-cart");

/**
 * @description  assigning button.clear-cart DOM to clearBtn object
 * @name clearBtn
 * @constant
 * @global
 * @type {Object}
 */
const clearBtn = document.querySelector(".clear-cart");

/**
 * @description  assigning div.cart DOM to cartDOM object
 * @name cartDOM
 * @constant
 * @global
 * @type {Object}
 */
const cartDOM = document.querySelector(".cart");
/**
 * @description  assigning  div.overlay DOM to cartOverlay object
 * @name cartOverlay
 * @constant
 * @global
 * @type {Object}
 */
const cartOverlay = document.querySelector(".cart-overlay");
/**
 * @description  assigning  div.cart-items html DOM element to cartItems object
 * @name cartItems
 * @constant
 * @global
 * @type {Object[]}
 */

const cartItems = document.querySelector(".cart-items");
/**
 * @description  assigning  span.cart-total html DOM element to cartTotal object
 * @name cartTotal
 * @constant
 * @global
 * @type {Object}
 */
const cartTotal = document.querySelector(".cart-total");
/**
 * @description  assigning  div.cart-content html DOM element to cartContent object
 * @name cartContent
 * @constant
 * @global
 * @type {Object}
 */
const cartContent = document.querySelector(".cart-content");
/**
 * @description  assigning  div.products-center html DOM element to productsDOM object
 * @name productsDOM
 * @constant
 * @global
 * @type {Object}
 */
const productsDOM = document.querySelector(".products-center");
/**
 * @description array of {@link cartItem} objects represents products was added to cart
 * @name cart
 * @type {Array.<cartItem>}
 *
 */
let cart = [];
/**
 * @description array of {@link buttons} objects represents buttons.btn-bag
 *  - note  "those buttons created and populated into DOM using javascript"
 * @name buttonsDOM
 * @type {Array.<Object>}  DOM element "document.querySelectorAll(".bag-btn")"
 *
 */
let buttonsDOM = [];
// getting the products
/**
 * @description class responsible about fetching and destructuring items(products)
 *  then  assigning them to an array of product object
 * @class
 * @name Products
 * @example const products = new Products();
 */
class Products {
  /**
   * @description fetching and destructuring items(products)
   *  then  assigning them to an array of product object
   * @name getProducts
   * @async
   * @inner
   * @public
   * @function
   * @returns [{Array.<Object>}] [array of product object]
   * @example products.getProducts();
   *
   */
  async getProducts() {
    /**
     * @description surrounding the functinality of the function in try-catch block
     *
     */
    try {
      /**
       * @await
       * @description asigning items to contentful object
       * @name contentful
       */
      let contentful = await client.getEntries({
        content_type: "comfyHouseFurrniture"
      });
      /**
       * @description testing function
       */
      console.log(contentful);
      let result = await fetch("../../products.json");
      let data = await result.json();
      /**
       * @description assigning to an array
       * @name products
       * @type {Array}
       */
      let products = contentful.items;
      // console.log(contentful);
      /**
       * @description destructuring items from the array then reassign as
       * @function
       * @name map   array higher order function
       * @param function
       * @returns {Array.<Object>}
       */
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });

      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(product => {
      result += `
        <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              class="product-img"
              alt="img product"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              Add to bag
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price} </h4>
        </article>
        <!-- end of single product -->
        `;
    });

    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    // buttonsDOM = buttons;
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.textContent = "In  Cart";
        button.disabled = true;
      }
      button.addEventListener("click", event => {
        event.target.textContent = "In  Cart";
        event.target.disabled = true;
        //   get product  from products
        let cartItem = { ...Storage.getProducts(id), amount: 1 };
        console.log(cartItem);
        // add product from to the  cart
        cart = [...cart, cartItem];
        // console.log(cart);
        // save product in the local storage
        Storage.saveCart(cart);
        //   set cart values
        this.setCartValues(cart);
        // display cart items
        this.addCartItem(cartItem);
        // show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.textContent = parseFloat(tempTotal.toFixed(2));
    cartItems.textContent = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${item.image} alt="" />
            <div>
              <h4> ${item.title} </h4>
              <h5>$${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
  
  `;
    cartContent.appendChild(div);
    // console.log(cart);
    // console.log(cartContent);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  //   setup App
  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // clear cart button
    clearBtn.addEventListener("click", () => {
      this.clearCart();
    });
    // cart functionality
    cartContent.addEventListener("click", () => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        // console.log(cart);
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        // console.log(cart);
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = "<i class='fas fa-shopping-cart'></i> Add to cart";
  }
  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

/**
 * @description class cares about adding and removing product in and from the browser local storage
 * contains main four functions
 *                              1- function  {@link saveProducts} saves {@link products} into the browser local storage
 *                              2- function  {@link getProducts} reads {@link products} from  the browser local storage
 *                              3- function  {@link saveCart} saves {@link cart} item into the browser local storage
 *                              4- function  {@link getCart} reads products from the browser local storage
 * @name Storage
 * @class
 * @example  const strage = new Storage();
 * @summary BROWSER LOCAL STORAGE   CREATING/READING OPERATIONS
 */

class Storage {
  /**
   * @description saving products in the browser localt storage takes products array as a parameter
   * {@link products}
   * @method
   * @static
   * @inner
   * @name saveProducts
   * @param {Array.<Object>}  pruducts to be saved
   * @example Storage.saveProducts(products);
   */
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  /**
   * @description reading products from  the browser localt storage takes the id of product as a parameter
   * and returns product matches that array
   * @method
   * @static
   * @inner
   * @name getProducts
   * @param {number}  id of item to be fetched
   * @example Storage.getProducts(1);
   * @returns {Object}
   */
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  /**
   * @description saving  cartItems array in  the browser local storage takes the {@link cart}  items array as a parameter
   * @method
   * @static
   * @inner
   * @name saveCart
   * @param {Array<Object>}  cart items {@link cartItems} to be saved
   * @example Storage.saveCart(cart)
   */
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  /**
   * @description reading (fetching)  cartItems   array {@link cart} from  the browser local storage
   * @method
   * @static
   * @inner
   * @name getCart
   * @param {Array<Object>}
   * @returns {Array.<Object>}  cart
   *  @example Storage.getCart()
   */
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  // set up methods
  ui.setupApp();
  //   get all prooducts
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
