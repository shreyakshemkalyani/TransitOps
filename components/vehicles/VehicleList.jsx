"use client";

import { useEffect, useState } from "react";
import VehicleTable from "./VehicleTable";

export default function VehicleList() {
  const defaultVehicles = [
    {
      id: 1,
      registrationNumber: "MH12AB1234",
      make: "Tata",
      model: "Ace",
      year: "2024",
      status: "Available",
    },
    {
      id: 2,
      registrationNumber: "MH14CD5678",
      make: "Mahindra",
      model: "Bolero",
      year: "2023",
      status: "On Trip",
    },
  ];

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("vehicles")) ||
      defaultVehicles;

    setVehicles(saved);

    if (!localStorage.getItem("vehicles")) {
      localStorage.setItem(
        "vehicles",
        JSON.stringify(defaultVehicles)
      );
    }
  }, []);

  return (
    <VehicleTable
      vehicles={vehicles}
      setVehicles={setVehicles}
    />
  );
}