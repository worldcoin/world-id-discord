import { Route, Routes } from "react-router-dom";
import { Auth } from "screens/Auth";
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
      <Route
        path="/auth"
        element={<Auth />}
      />
    </Routes>
  );
}

export default App;
