import React from "react";
import logoImage from "../../assets/WhatsApp Image 2025-08-19 at 2.29.11 PM.jpeg"; 

const Profile = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <img
            src={logoImage}
            alt="CEO"
            className="w-36 h-36 rounded-full border-4 border-blue-500 object-cover shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Sugan K.
            </h1>
            <p className="text-blue-600 font-semibold text-lg">
              Chief Executive Officer
            </p>
            <p className="text-gray-500 mt-2">
              Driving innovation and growth at <span className="font-bold">Newtonsky5</span>.
            </p>
          </div>
        </div>

        {/* Company Overview */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Newtonsky5
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Newtonsky5 is a forward-thinking technology company committed to 
            delivering next-generation digital solutions. Our mission is to 
            empower businesses and individuals with smart, scalable, and 
            secure technology. We specialize in software development, IoT 
            integrations, AI-powered automation, and digital transformation 
            consulting.
          </p>
        </div>

        {/* Company Values */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Innovation</h3>
            <p className="text-gray-600 text-sm">
              We push boundaries to bring cutting-edge solutions that make 
              businesses future-ready.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Integrity</h3>
            <p className="text-gray-600 text-sm">
              Transparency and trust are at the core of everything we build and deliver.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Excellence</h3>
            <p className="text-gray-600 text-sm">
              Our goal is to exceed expectations by delivering high-quality and reliable services.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 mb-2">
            📍 Location: Chengalpattu, India
          </p>
          <p className="text-gray-600 mb-2">
            📧 Email: newtonsky5@gmail.com
          </p>
          <p className="text-gray-600">
            📞 Phone: +91 98765 43210
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
