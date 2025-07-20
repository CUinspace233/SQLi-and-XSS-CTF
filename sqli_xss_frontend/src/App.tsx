import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SQLi1 from "./pages/SQLi1";
import SQLi2 from "./pages/SQLi2";
import XSS from "./pages/XSS";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sqli1" element={<SQLi1 />} />
        <Route path="/sqli2" element={<SQLi2 />} />
        <Route path="/xss" element={<XSS />} />
        <Route path="*" element={<Navigate to="/sqli1" replace />} />
      </Routes>
    </Router>
  );
}
