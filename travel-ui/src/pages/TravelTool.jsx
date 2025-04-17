import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TravelTool() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await axios.post("http://localhost:8000/recommend-travel", {
          name: "John Smith",
          crew_id: "AA1234",
          base: "LAX",
          gateway: "SYD",
          preferred_airlines: ["Qantas", "Delta"],
          seat_pref: "Window",
          travel_type: "Alternate Deadhead",
          duty_start_time: "2025-04-20T09:00:00Z",
          schedule: {
            pairing_id: "PX4321",
            check_in: "2025-04-20T09:00:00Z",
            sign_on_airport: "ICN"
          },
          loa_status: "None",
          class_of_service: "Business",
          estimated_block_time_hours: 10,
          cba_rules: {
            max_reposition_time: 720
          }
        });

        setResult(response.data);
      } catch (err) {
        console.error("Request failed:", err);
        setError("❌ Request failed.");
      }
    };

    sendRequest();
  }, []);

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-orange-500">Travel Tool is rendering</h1>
      {result && (
        <pre className="bg-gray-800 p-4 rounded text-green-400 overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}