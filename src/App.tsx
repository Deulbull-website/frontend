import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Apply from './pages/Apply';
import ApplyForm from './pages/ApplyForm';

// 메뉴 이동(Link) 시 이전 페이지에서 스크롤했던 위치가 그대로 남아있지 않도록,
// 경로가 바뀔 때마다 화면 맨 위로 스크롤합니다.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/form" element={<ApplyForm />} />
      </Routes>
    </>
  );
}
