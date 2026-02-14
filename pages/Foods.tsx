import React from 'react';
import { Utensils, ShoppingBag, Store, Truck } from 'lucide-react';

const Foods: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="bg-foods-600 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
            <Utensils size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">AM Foods</h1>
          <p className="text-xl text-lime-100 max-w-2xl">Taste of Tradition, Speed of Cloud. Culinary excellence meets modern convenience.</p>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-2xl shadow-lg group">
             <div className="h-48 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <Store size={64} className="text-slate-400" />
             </div>
             <div className="p-8">
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Cloud Kitchens</h3>
               <p className="text-slate-600 dark:text-slate-400 mb-4">Hygienic, fast, and delicious. Our cloud kitchens serve authentic regional cuisines across 3 cities.</p>
               <button className="text-foods-600 font-bold hover:underline">View Menu & Order &rarr;</button>
             </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-2xl shadow-lg group">
             <div className="h-48 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <ShoppingBag size={64} className="text-slate-400" />
             </div>
             <div className="p-8">
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Packaged Foods</h3>
               <p className="text-slate-600 dark:text-slate-400 mb-4">Premium spices, ready-to-eat mixes, and snacks delivered to your doorstep.</p>
               <button className="text-foods-600 font-bold hover:underline">Browse Products &rarr;</button>
             </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
           <div className="mb-6 md:mb-0">
             <h2 className="text-2xl font-bold mb-2">Partner with AM Foods</h2>
             <p className="text-slate-400">Franchise opportunities available for our Cloud Kitchen model.</p>
           </div>
           <button className="bg-foods-500 text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-foods-400 transition">
             Enquire Now
           </button>
        </div>
      </section>
    </div>
  );
};

export default Foods;