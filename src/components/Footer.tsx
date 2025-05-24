import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-primary/90 text-gray-300 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-xl cursor-pointer font-bold">
                Paisa <span className="text-gray-400">Sambhalo</span>
              </h1>
            </div>
            <p className="text-sm">
              Smart finance management powered by AI. Track, analyze, and
              optimize your money effortlessly.
            </p>
            <div className="flex gap-4">
              <a href="">
                <Twitter className="w-5 h-5 hover:text-blue-400" />
              </a>
              <a href="https://www.linkedin.com/in/majid-ali-pahore/">
                <Linkedin className="w-5 h-5 hover:text-blue-600" />
              </a>
              <a href="https://github.com/majidali55566">
                <Github className="w-5 h-5 hover:text-white" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-medium">Navigations</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/signup">Sign up</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-white font-medium">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>majidalipahore55566@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+92 3160254715</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Karachi Sindh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 my-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FinAI. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <a href="" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="" className="hover:text-white transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
