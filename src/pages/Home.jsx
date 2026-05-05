import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    description: 'Active noise cancellation with 30-hour battery life and immersive spatial audio.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  },
  {
    id: 2,
    name: 'Minimalist Smartwatch',
    description: 'Track your fitness, heart rate, and notifications with this sleek, waterproof timepiece.',
    price: 199.50,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
  },
  {
    id: 3,
    name: 'Ergonomic Desk Chair',
    description: 'Designed for long hours of comfort with adjustable lumbar support and breathable mesh.',
    price: 349.00,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80'
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    description: 'Tactile switches with customizable RGB backlighting and an aluminum chassis.',
    price: 145.00,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'
  },
  {
    id: 5,
    name: '4K Action Camera',
    description: 'Waterproof up to 33ft, capturing ultra-smooth 4K video for your wildest adventures.',
    price: 279.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&q=80'
  },
  {
    id: 6,
    name: 'Ceramic Coffee Dripper',
    description: 'Hand-crafted ceramic pour-over coffee maker for the perfect morning brew.',
    price: 35.00,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80'
  },
  {
    id: 7,
    name: 'Leather Messenger Bag',
    description: 'Premium full-grain leather bag with laptop sleeve and multiple organizational pockets.',
    price: 125.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
  },
  {
    id: 8,
    name: 'Modern Accent Table',
    description: 'Mid-century modern inspired side table with walnut finish and matte black metal legs.',
    price: 89.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80'
  }
];

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Furniture', 'Home & Kitchen'];

export const Home = () => {
  const { addToCart } = useCart();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search')?.toLowerCase() || '';

    let result = MOCK_PRODUCTS;

    if (search) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(search) || 
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    }

    if (activeCategory !== 'All') {
      result = result.filter(product => product.category === activeCategory);
    }

    setFilteredProducts(result);
  }, [location.search, activeCategory]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Welcome to UrbanBazaar</h1>
          <p>Discover premium products curated for your modern lifestyle. Quality you can trust, delivered straight to your door.</p>
        </div>
      </section>

      <main className="container">
        <div className="category-filters">
          {CATEGORIES.map(category => (
            <button 
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-img-container">
                <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
                <span className="product-category-badge">{product.category}</span>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={18} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="empty-state" style={{ marginTop: '2rem' }}>
            <h3>No products found</h3>
            <p>We couldn't find any products matching your search or category.</p>
          </div>
        )}
      </main>
    </>
  );
};
