import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
          alt="Pottery Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-b-3xl"
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-orange-700 drop-shadow-lg mb-4">
            Handcrafted Pottery for Your Home
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 font-medium mb-8">
            Discover unique, artisan-made ceramics that bring warmth and beauty to every space.
          </p>
          <Link
            href="/collection"
            className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-orange-700 mb-10 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Category Card */}
          {[
            {
              title: "Mugs",
              img: "/images/mug.jpg",
              link: "/collection?category=mugs",
            },
            {
              title: "Jugs",
              img: "/images/jug.png",
              link: "/collection?category=jugs",
            },
            {
              title: "Vases",
              img: "/images/Handpainted terracotta vases1.jpg",
              link: "/collection?category=vases",
            },
            {
              title: "Plates",
              img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
              link: "/collection?category=plates",
            },
            {
              title: "Decor",
              img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80",
              link: "/collection?category=decor",
            },
          ].map((cat) => (
            <Link
              key={cat.title}
              href={cat.link}
              className="bg-white/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col items-center p-6 group border-2 border-orange-100 hover:border-orange-300"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-orange-200 group-hover:border-orange-400 transition-all duration-200"
              />
              <span className="text-xl font-bold text-orange-700 mb-2">{cat.title}</span>
              <span className="text-sm text-gray-500 group-hover:text-orange-600">Shop Now →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* About/Story Teaser */}
      <section className="max-w-4xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-10">
        <img
          src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80"
          alt="Potter at work"
          className="w-64 h-64 object-cover rounded-3xl shadow-lg border-4 border-orange-100"
        />
        <div>
          <h3 className="text-2xl font-bold text-orange-700 mb-4">Our Story</h3>
          <p className="text-gray-700 text-lg mb-4">
            At ClayBlossoms, every piece is a celebration of tradition, creativity, and the beauty of imperfection. Our artisans pour their heart into every creation, ensuring you get a unique piece of art for your home.
          </p>
          <Link
            href="/about"
            className="inline-block px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-gradient-to-r from-orange-100 via-pink-100 to-yellow-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-orange-700 mb-10 text-center">Best Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Example Product Cards */}
            {[
              {
                name: "Sowpeace",
                price: "₹6999",
                img: "/images/sowpeace.jpg",
              },
              {
                name: "Kettle",
                price: "₹1899",
                img: "/images/kettle.png",
              },
              {
                name: "Blossom Plate",
                price: "₹699",
                img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Artisan Decor",
                price: "₹1299",
                img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80",
              },
            ].map((prod) => (
              <div
                key={prod.name}
                className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col items-center p-6 border-2 border-orange-100 hover:border-orange-300"
              >
                <img
                  src={prod.img}
                  alt={prod.name}
                  className="w-32 h-32 object-cover rounded-2xl mb-4 border-4 border-orange-200"
                />
                <span className="text-lg font-bold text-orange-700 mb-1">{prod.name}</span>
                <span className="text-md text-gray-700 mb-2">{prod.price}</span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition" aria-label="Add to Wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-pink-400 hover:text-pink-600">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 transition" aria-label="Add to Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L21 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="bg-white/90 rounded-2xl shadow-lg p-8 border-2 border-orange-100">
          <h3 className="text-2xl font-bold text-orange-700 mb-4">Get 10% Off Your First Order!</h3>
          <p className="text-gray-700 mb-6">Subscribe to our newsletter for exclusive offers, new arrivals, and pottery inspiration.</p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-full border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white/70 text-gray-700 w-full sm:w-auto"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}