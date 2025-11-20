//import api from "../api/axios";
import { backend } from "../api/client";

export default function TestToken() {
  const test = async () => {
    const res = await backend.testToken();
    console.log("Backend response:", res);
  };

  return <button onClick={test}>Test Token</button>;
}
