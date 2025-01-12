import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import "./globals.css";

export const metadata = {
  title: "FolioHive Platform",
  description: "Showcase your projects with analytics, ratings, and comments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider> {/* Wrap the application with AuthProvider */}
          <Navbar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}