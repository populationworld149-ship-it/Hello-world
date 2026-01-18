import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { products, Product, Category } from './data';

function App() {
  const [currentCategory, setCurrentCategory] = useState<Category>('FOOD');
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState<'NONE' | 'INGREDIENTS' | 'ACCOUNT' | 'CART'>('NONE');
  const [cart, setCart] = useState<Product[]>([]);

  // Filter products by category
  const categoryProducts = products.filter(p => p.category === currentCategory);
  // Ensure index is valid, though reset handles it usually
  const safeIndex = Math.min(currentProductIndex, categoryProducts.length - 1);
  const currentProduct = categoryProducts[safeIndex >= 0 ? safeIndex : 0];

  const handleNext = () => {
    setCurrentProductIndex((prev) => (prev + 1) % categoryProducts.length);
  };

  const handlePrev = () => {
    setCurrentProductIndex((prev) => (prev - 1 + categoryProducts.length) % categoryProducts.length);
  };

  const handleCategoryChange = (category: Category) => {
    if (category !== currentCategory) {
      setCurrentCategory(category);
      setCurrentProductIndex(0);
    }
  };

  const addToCart = () => {
    if (currentProduct) {
      setCart([...cart, currentProduct]);
      alert('Added to cart!'); // Simple confirmation as requested
    }
  };

  // Animation variants
  const variants = {
    enter: {
      x: -300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: 300,
      opacity: 0,
    },
  };

  if (!currentProduct) return <div>Loading...</div>;

  return (
    <div className="h-screen w-screen bg-cafe-bg overflow-hidden flex text-white font-sans relative">
      {/* LEFT COLUMN - Categories */}
      <div className="w-1/4 h-full flex flex-col justify-center items-start pl-12 space-y-8 z-10">
        {(['FOOD', 'DRINKS', 'PASTRIES'] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`text-2xl md:text-3xl font-light tracking-wide hover:scale-105 transition-transform text-left
              ${currentCategory === cat ? 'font-bold' : 'opacity-80'}
            `}
          >
            {cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* CENTER - Plate + Product + Arrows */}
      <div className="w-2/4 h-full relative flex items-center justify-center">
        {/* Left Arrow */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 md:left-12 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
        >
          <ArrowLeft size={32} color="white" />
        </button>

        {/* Plate (Fixed Background) */}
        <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-black/20 rounded-full blur-sm transform translate-y-4 scale-90"></div>
        <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-gray-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-700">
           {/* Inner plate shadow/shine could go here */}
           <div className="w-[95%] h-[95%] bg-gray-900 rounded-full"></div>
        </div>

        {/* Product Image (Animated) */}
        <div className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center relative z-10">
          <AnimatePresence mode='popLayout' initial={false}>
            <motion.img
              key={`${currentCategory}-${currentProduct.id}`}
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-48 h-48 md:w-72 md:h-72 object-contain absolute drop-shadow-2xl"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button 
          onClick={handleNext}
          className="absolute right-4 md:right-12 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
        >
          <ArrowRight size={32} color="white" />
        </button>
      </div>

      {/* RIGHT COLUMN - Actions */}
      <div className="w-1/4 h-full flex flex-col justify-center items-end pr-12 space-y-8 z-10">
        <button onClick={addToCart} className="text-xl md:text-2xl font-light tracking-wide hover:scale-105 transition-transform text-right">
          Add to order
        </button>
        <button onClick={() => setModalOpen('INGREDIENTS')} className="text-xl md:text-2xl font-light tracking-wide hover:scale-105 transition-transform text-right">
          ingredients
        </button>
        <button onClick={() => setModalOpen('ACCOUNT')} className="text-xl md:text-2xl font-light tracking-wide hover:scale-105 transition-transform text-right">
          Account
        </button>
        <div className="text-right">
           <button onClick={() => setModalOpen('CART')} className="text-xl md:text-2xl font-light tracking-wide hover:scale-105 transition-transform text-right">
            cart
          </button>
          {cart.length > 0 && <span className="block text-sm opacity-80">{cart.length} items</span>}
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {modalOpen !== 'NONE' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen('NONE')}
            />
            
            {/* Modal Card */}
            <motion.div 
              className="relative bg-cafe-light-pink text-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button 
                onClick={() => setModalOpen('NONE')}
                className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              {modalOpen === 'INGREDIENTS' && (
                <div className="text-center">
                  <h2 className="text-3xl font-serif mb-4 text-cafe-pink">{currentProduct.name}</h2>
                  <div className="border-t border-dashed border-gray-400 my-4"></div>
                  
                  {currentProduct.category === 'DRINKS' && currentProduct.sizes && (
                     <div className="mb-6">
                        <h3 className="text-lg font-bold mb-2">Select Size</h3>
                        <div className="flex justify-center space-x-4">
                          {currentProduct.sizes.map(size => (
                            <button key={size} className="px-3 py-1 border border-cafe-pink text-cafe-pink rounded hover:bg-cafe-pink hover:text-white transition-colors">
                              {size}
                            </button>
                          ))}
                        </div>
                     </div>
                  )}

                  <h3 className="text-lg font-bold mb-2">Ingredients</h3>
                  <ul className="space-y-1">
                    {currentProduct.ingredients.map((ing, i) => (
                      <li key={i} className="text-lg opacity-80">{ing}</li>
                    ))}
                  </ul>
                </div>
              )}

              {modalOpen === 'ACCOUNT' && (
                <div className="text-center">
                  <h2 className="text-3xl font-serif mb-4 text-cafe-pink">Account</h2>
                  <div className="border-t border-dashed border-gray-400 my-4"></div>
                  <p className="mb-4">Please log in to your account.</p>
                  <input type="email" placeholder="Email" className="w-full p-2 mb-2 border rounded" />
                  <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" />
                  <button className="bg-cafe-pink text-white px-6 py-2 rounded-full w-full">Sign In</button>
                </div>
              )}

              {modalOpen === 'CART' && (
                <div className="text-center">
                  <h2 className="text-3xl font-serif mb-4 text-cafe-pink">Cart</h2>
                  <div className="border-t border-dashed border-gray-400 my-4"></div>
                  {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto mb-4">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                          <span>{item.name}</span>
                          <span>${item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {cart.length > 0 && (
                    <div className="border-t border-gray-400 pt-4 mt-2">
                       <div className="flex justify-between font-bold mb-4">
                          <span>Total</span>
                          <span>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                       </div>
                       <button className="bg-cafe-pink text-white px-6 py-2 rounded-full w-full">Checkout</button>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
