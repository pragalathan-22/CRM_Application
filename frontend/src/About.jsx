import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          We are dedicated to building modern solutions that empower businesses
          and individuals to achieve more with technology.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To provide innovative, scalable, and user-friendly digital solutions
            that drive growth, improve efficiency, and create lasting value for
            our clients worldwide.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To be a global leader in technology innovation, empowering people
            and organizations to unlock their full potential in the digital era.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                We embrace creativity and strive to deliver groundbreaking
                solutions that make a difference.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                Integrity
              </h3>
              <p className="text-gray-600">
                We believe in honesty, transparency, and building trust with our
                clients and partners.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                Excellence
              </h3>
              <p className="text-gray-600">
                We are committed to delivering high-quality solutions and
                exceeding expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-20 bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Let’s Build Something Great Together
        </h2>
        <p className="max-w-xl mx-auto mb-6 opacity-90">
          Partner with us to create innovative solutions and transform your
          business for the digital future.
        </p>
        <a
          href="/contact"
          className="bg-white text-indigo-700 font-medium px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default About;
