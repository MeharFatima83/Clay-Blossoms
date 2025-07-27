import '../globals.css';
import NavBar from '../../components/NavBar';
import { CartProvider } from '../../components/CartContext';
import { WishlistProvider } from '../../components/WishlistContext';

export default function Layout({ children }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <NavBar />
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}