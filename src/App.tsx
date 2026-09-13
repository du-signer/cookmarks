import { Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { UploadScreen } from "./screens/UploadScreen";
import { CookmarksListScreen } from "./screens/CookmarksListScreen";
import { CookmarkDetailScreen } from "./screens/CookmarkDetailScreen";
import { FridgeCheckScreen } from "./screens/FridgeCheckScreen";
import { MatchResultsScreen } from "./screens/MatchResultsScreen";
import { GroceryListScreen } from "./screens/GroceryListScreen";

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<UploadScreen />} />
          <Route path="/cookmarks" element={<CookmarksListScreen />} />
          <Route path="/cookmarks/:id" element={<CookmarkDetailScreen />} />
          <Route path="/fridge" element={<FridgeCheckScreen />} />
          <Route path="/fridge/results" element={<MatchResultsScreen />} />
          <Route path="/grocery" element={<GroceryListScreen />} />
        </Routes>
      </main>
    </div>
  );
}
