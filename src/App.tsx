import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Apply from './pages/Apply';
import ApplyForm from './pages/ApplyForm';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/apply/form" element={<ApplyForm />} />
    </Routes>
  );
}
