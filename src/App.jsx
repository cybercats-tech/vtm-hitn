import { useEffect } from "react";
import { init } from "./charts/org";
import "./App.css";
import { load } from "./loadData";

function App() {
  useEffect(() => {
    load().then(init)
    // const d = init();

    // return () => d.clear()
  }, []);

  return (
    <>
      <div id="diagram" />
      <div id="map" />
    </>
  );
}

export default App;
