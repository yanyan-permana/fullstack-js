import {BrowserRouter, Routes, Route} from "react-router-dom";
import IndexMovie from "./components/movies/Index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexMovie />}/>
        {/* <Route path="add" element={<AddProduct/>}/>
        <Route path="edit/:id" element={<EditProduct/>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
