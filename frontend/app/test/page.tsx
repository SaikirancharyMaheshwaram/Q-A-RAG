// "use client";

// import axios from "axios";
// import { useState } from "react";

// export default function Home() {
//   const [message, setMessage] = useState("atest");

//   const handleLogin = async () => {
//     try {
//       const res = await axios.get("http://localhost:3001/api/chat", {
//         withCredentials: true,
//       });
//       setMessage(JSON.stringify(res.data, null, 2));
//     } catch (error) {
//       console.log(error);
//       setMessage("Login failed");
//     }
//   };
//   return (
//     <div className="text-3xl font-semibold w-4xl mx-auto border border-gray-200 h-screen p-8 m-2 ">
//       <div>Protected Route</div>
//       <button onClick={handleLogin}>Send test</button>
//       <p>{message}</p>
//     </div>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");

  const handleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setMessage("Login failed: no credential");
      return;
    }
    setId(credentialResponse.credential);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/google",
        {
          id_token: credentialResponse.credential,
        },
        {
          withCredentials: true,
        },
      );

      if (!res.data.success) throw new Error("Login failed");

      setMessage("Login successful!");
      setId(res.data.token);
    } catch (error) {
      setMessage("Login failed");
    }
  };
  return (
    <div className="text-3xl font-semibold w-4xl mx-auto border border-gray-200 h-screen p-8 m-2 ">
      <div>Google Login</div>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => setMessage("Login Failed")}
      />
      <p>{message}</p>
    </div>
  );
}
