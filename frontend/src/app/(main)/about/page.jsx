import React from "react";

export default function AboutPage() {
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
            About ClayBlossoms
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 font-medium mb-8">
            Handcrafted pottery and art that brings warmth, beauty, and creativity to your home.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-5xl mx-auto py-12 px-4 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: "🌱",
            title: "Sustainability",
            desc: "We use eco-friendly materials and processes to protect our planet for future generations."
          },
          {
            icon: "🤲",
            title: "Handcrafted",
            desc: "Every piece is shaped by hand, ensuring uniqueness and a personal touch in every creation."
          },
          {
            icon: "🤝",
            title: "Community",
            desc: "We support local artisans and foster a community of creativity and collaboration."
          }
        ].map((val) => (
          <div key={val.title} className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-orange-100">
            <span className="text-4xl mb-4">{val.icon}</span>
            <h3 className="text-xl font-bold text-orange-700 mb-2">{val.title}</h3>
            <p className="text-gray-700 text-center">{val.desc}</p>
          </div>
        ))}
      </section>

      {/* Artisan Highlight */}
      <section className="max-w-4xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-10">
        <img
          src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80"
          alt="Potter at work"
          className="w-64 h-64 object-cover rounded-3xl shadow-lg border-4 border-orange-100"
        />
        <div>
          <h3 className="text-2xl font-bold text-orange-700 mb-4">Meet Our Artisans</h3>
          <p className="text-gray-700 text-lg mb-4">
            Our talented artisans pour their heart and soul into every piece, blending tradition with creativity. Each item is a testament to their skill, passion, and dedication to the art of pottery.
          </p>
          <p className="text-orange-700 font-semibold">"Every piece tells a story."</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-orange-100 via-pink-100 to-yellow-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-orange-700 mb-10 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya S.",
                text: "The quality and beauty of ClayBlossoms pottery is unmatched. My home feels warmer and more inviting!",
                img: "https://randomuser.me/api/portraits/women/68.jpg"
              },
              {
                name: "Rahul M.",
                text: "I love that every piece is unique. You can feel the love and care in every detail.",
                img: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Aarti K.",
                text: "Supporting local artisans and getting beautiful pottery? Win-win! Highly recommend ClayBlossoms.",
                img: "https://randomuser.me/api/portraits/women/44.jpg"
              }
            ].map((t) => (
              <div key={t.name} className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-orange-100">
                <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full mb-4 border-4 border-orange-200 object-cover" />
                <p className="text-gray-700 italic mb-2">“{t.text}”</p>
                <span className="text-orange-700 font-bold">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}