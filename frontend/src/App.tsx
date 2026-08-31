import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Collections from "@/pages/Collections";
import CollectionDetail from "@/pages/CollectionDetail";
import Places from "@/pages/Places";
import Films from "@/pages/Films";
import Reels from "@/pages/Reels";
import Stories from "@/pages/Stories";
import StoryDetail from "@/pages/StoryDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Prints from "@/pages/Prints";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminMedia from "@/pages/AdminMedia";
import AdminUpload from "@/pages/AdminUpload";
import AdminCollections from "@/pages/AdminCollections";
import AdminPlaces from "@/pages/AdminPlaces";
import AdminStories from "@/pages/AdminStories";
import AdminSettings from "@/pages/AdminSettings";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Discovery World */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/places" element={<Places />} />
        <Route path="/films" element={<Films />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:id" element={<StoryDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/prints" element={<Prints />} />

        {/* Private Admin Studio CMS */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/media" element={<AdminMedia />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
        <Route path="/admin/collections" element={<AdminCollections />} />
        <Route path="/admin/places" element={<AdminPlaces />} />
        <Route path="/admin/stories" element={<AdminStories />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </>
  );
}
