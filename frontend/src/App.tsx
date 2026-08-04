import { AppProvider } from "./app/providers/appProvider";
import "./index.scss";

function App() {
  return (
    <div className="app">
      <AppProvider />
    </div>
  );
}

export default App;
