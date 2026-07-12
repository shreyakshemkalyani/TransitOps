"use client";

import { useEffect, useState } from "react";
import DriverTable from "./DriverTable";

export default function DriverList() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const savedDrivers =
      JSON.parse(localStorage.getItem("drivers")) || [
        {
          id: 1,
          name: "Alex",
          licenseNumber: "DL-89813",
          category: "LMV",
          status: "Available",
        },
        {
          id: 2,
          name: "John",
          licenseNumber: "DL-44120",
          category: "HMV",
          status: "Suspended",
        },
        {
          id: 3,
          name: "Priya",
          licenseNumber: "DL-77031",
          category: "LMV",
          status: "On Trip",
        },
      ];

    setDrivers(savedDrivers);
  }, []);

  return (
    <DriverTable
      drivers={drivers}
      setDrivers={setDrivers}
    />
  );
}