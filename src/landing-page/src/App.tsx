import { Route, Routes } from "react-router-dom";
import { Configuration } from "./screens/Configuration";
import { Home } from "./screens/Home";

function App() {
  return (
    <Routes>
      <Route
        path="*"
        element={<Home />}
      />
      <Route
        path="/configuration"
        element={<Configuration />}
      />
    </Routes>
  );
}

export default App;
