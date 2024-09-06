import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignupForm from "./components/SignupForm";
import Header from "./components/Header";
import EditorPage from "./components/Editor";
import Notes from "./components/Notes";

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow p-6 bg-gray-100">
            <Routes>
              <Route path="/" element={<SignupForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/notes" element={<Notes />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
