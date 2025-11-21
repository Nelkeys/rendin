import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import Header from "./components/Header";
import AddButton from "./components/AddButton";

// Pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import Article from "./pages/Article";
import Profile from "./pages/Profile";
import AddArticle from "./pages/AddArticle";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/add-article" element={<AddArticle />} />
      </Routes>
      <AddButton />
    </Router>
  );
}

export default App;
