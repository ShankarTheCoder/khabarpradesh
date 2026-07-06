import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ArticleDetail from "./pages/ArticleDetail";
import SearchResults from "./pages/SearchResults";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEditor from "./pages/AdminEditor";

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
          <Route path="/category/:category" element={<SiteLayout><CategoryPage /></SiteLayout>} />
          <Route path="/article/:slug" element={<SiteLayout><ArticleDetail /></SiteLayout>} />
          <Route path="/search" element={<SiteLayout><SearchResults /></SiteLayout>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/news/new"
            element={
              <ProtectedRoute>
                <AdminEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/news/:id/edit"
            element={
              <ProtectedRoute>
                <AdminEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <SiteLayout>
                <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                  <h1 className="font-display text-4xl text-ink mb-3">404</h1>
                  <p className="text-slate">यो पृष्ठ उपलब्ध छैन।</p>
                </div>
              </SiteLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
