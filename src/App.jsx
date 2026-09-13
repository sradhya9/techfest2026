import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Registration from "./pages/Registration";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import { useTheme } from "./context/ThemeContext";

function App() {
 const { theme } = useTheme();

 return (
 <div className={theme}>
 <Navbar />
 <main className="main-content">
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/events" element={<Events />} />
 <Route path="/register" element={<Registration />} />
 <Route path="/gallery" element={<Gallery />} />
 <Route path="/contact" element={<Contact />} />
 <Route path="/dashboard" element={<Dashboard />} />
 <Route path="*" element={<NotFound />} />
 </Routes>
 </main>
 </div>
 );
}

export default App;
