import React from "react";

const Contact = () => {
  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We’d love to hear from you! Whether you have a question about
            services, pricing, or anything else — our team is ready to answer
            all your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Message</label>
                <textarea
                  rows="4"
                  placeholder="Write your message here..."
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Contact Info</h3>
              <p className="mt-2 text-gray-600">
                Reach out to us using the details below or fill out the form.
              </p>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900">📍 Address</p>
              <p className="text-gray-600">123 Business Street, Chennai, India</p>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900">📞 Phone</p>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900">✉️ Email</p>
              <p className="text-gray-600">support@yourcompany.com</p>
            </div>

            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 transition"
              >
                🌐 Facebook
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 transition"
              >
                🐦 Twitter
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 transition"
              >
                💼 LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
