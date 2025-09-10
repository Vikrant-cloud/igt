import { motion } from "framer-motion";
import Button from "../components/Button";
import { Link } from "react-router";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white/70 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-indigo-600">IGT Learning</h1>
        <nav className="space-x-6 hidden md:block">
          <a href="#features" className="text-gray-600 hover:text-indigo-600 transition">Features</a>
          <a href="#courses" className="text-gray-600 hover:text-indigo-600 transition">Courses</a>
          <a href="#about" className="text-gray-600 hover:text-indigo-600 transition">About</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-12 md:py-24">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Learn Without Limits 🚀
          </h2>
          <p className="text-lg text-gray-600">
            A next-gen platform for students and teachers. Join interactive
            courses, live classes, and grow your skills with IGT Learning.
          </p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="rounded-2xl px-6 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
            >
              Login as User
            </Link>
            <Link
              to="/admin/login"
              className="rounded-2xl px-6 py-3 text-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50 shadow-md"
            >
              Login as Admin
            </Link>
          </div>
        </motion.div>

        {/* Right Content / Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 md:mt-0"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/6850/6850537.png"
            alt="Student taking notes"
            className="w-full max-w-md"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 md:px-16 lg:px-32 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose IGT Learning?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Live Classes",
              desc: "Attend interactive classes in real-time with expert teachers.",
              icon: "🎥",
            },
            {
              title: "Track Progress",
              desc: "Monitor your growth with detailed analytics and reports.",
              icon: "📊",
            },
            {
              title: "Anytime Access",
              desc: "Learn anywhere, anytime with recorded lectures and notes.",
              icon: "📱",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl shadow-md bg-indigo-50 border border-indigo-100"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{f.title}</h4>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-white shadow-inner">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} IGT Learning. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
