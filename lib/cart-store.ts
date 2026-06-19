export type CartProduct = {
    slug: string;
    name: string;
    price: number;
    image: string;
    weight: string;
  };
  
  export type CartItem = CartProduct & {
    quantity: number;
  };
  
  const CART_KEY = 'deshiyoshad-cart';
  
  export function getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
  
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }
  
  export function saveCart(cart: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  }
  
  export function addToCart(product: CartProduct) {
    const cart = getCart();
    const existing = cart.find((item) => item.slug === product.slug);
  
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  
    saveCart(cart);
  }
  
  export function removeFromCart(slug: string) {
    const cart = getCart().filter((item) => item.slug !== slug);
    saveCart(cart);
  }
  
  export function updateCartQuantity(slug: string, quantity: number) {
    const cart = getCart();
  
    const updatedCart = cart
      .map((item) =>
        item.slug === slug ? { ...item, quantity } : item
      )
      .filter((item) => item.quantity > 0);
  
    saveCart(updatedCart);
  }
  
  export function clearCart() {
    saveCart([]);
  }