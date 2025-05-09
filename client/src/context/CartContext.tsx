import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { CartItem } from "@shared/schema";

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getSubtotal: (products: any[]) => number;
}

// Create a default context value to avoid undefined errors
const defaultCartContext: CartContextType = {
  cart: [],
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartCount: () => 0,
  getSubtotal: () => 0
};

const CartContext = createContext<CartContextType>(defaultCartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      // Only run this on client-side
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem("trossachs_cart");
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            console.log("Loading cart from localStorage:", parsedCart);
            setCart(parsedCart);
          } catch (error) {
            console.error("Failed to parse cart from localStorage:", error);
            setCart([]);
          }
        }
        setIsInitialized(true);
      }
    } catch (e) {
      console.error("Error in CartProvider initialization:", e);
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        console.log("Saving cart to localStorage:", cart);
        localStorage.setItem("trossachs_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Error saving cart to localStorage:", e);
      }
    }
  }, [cart, isInitialized]);

  const openCart = () => setIsCartOpen(true);
  
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (productId: number, quantity = 1) => {
    console.log("Adding to cart:", productId, quantity);
    
    setCart(prevCart => {
      // Make sure productId is a number
      const numericProductId = Number(productId);
      
      const existingItem = prevCart.find(item => item.productId === numericProductId);
      
      let newCart;
      if (existingItem) {
        newCart = prevCart.map(item => 
          item.productId === numericProductId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        newCart = [...prevCart, { productId: numericProductId, quantity }];
      }
      
      console.log("New cart state:", newCart);
      return newCart;
    });
    
    // Open the cart after a short delay to ensure state is updated
    setTimeout(() => {
      openCart();
    }, 100);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    console.log("Updating quantity for product:", productId, "to", quantity);
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = (products: any[]) => {
    return cart.reduce((total, cartItem) => {
      const product = products.find(p => p.id === cartItem.productId);
      if (product) {
        return total + (product.price * cartItem.quantity);
      }
      return total;
    }, 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        isCartOpen, 
        openCart, 
        closeCart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartCount,
        getSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  // Should never be undefined now with default context
  return useContext(CartContext);
}
