"use client";

import { useState } from "react";

export default function VehicleTable() {
  const [search, setSearch] = useState("");

  const vehicles = [
    {
      id: 1,
      regNo: "GJ01AB4521",
      name: "VAN-05",
      type: "Van",
      capacity: "500 kg",
      odometer: "74,000",
      cost: "6,20,000",
      status: "Available",
    },
    {
      id: 2,
      regNo: "GJ01AB9198",
      name: "TRUCK-11",
      type: "Truck",
      capacity: "5 Ton",
      odometer: "182,000",
      cost: "34,50,000",
      status: "On Trip",
    },
    {
      id: 3,
      regNo: "GJ01AB1130",
      name: "MINI-03",
      type: "Mini",
      capacity: "1 Ton",
      odometer: "66,000",
      cost: "4,10,000",
      status: "In Shop",
    },
    {
      id: 4,
      regNo: "GJ01AB008",
      name: "VAN-09",
      type: "Van",
      capacity: "750 kg",
      odometer: "241,900",
      cost: "5,90,000",
      status: "Retired",
    },
  ];

  const badgeColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-500 text-black";
      case "On Trip":
        return "bg-blue-500 text-black";
      case "In Shop":
        return "bg-orange-500 text-black";
      case "Retired":
        return "bg-red-400 text-black";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="text-white">
      <h1 className="mb-6 text-3xl font-bold">
        Vehicle Registry
      </h1>

      <div className="rounded-xl border border-gray-700 bg-black p-5">

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 rounded border border-gray-700 bg-[#111] px-3 py-2"
          />
        </div>

        <div className="mb-5 flex gap-3">
          <select className="rounded border border-gray-700 bg-[#111] px-3 py-2">
            <option>Type: All</option>
          </select>

          <select className="rounded border border-gray-700 bg-[#111] px-3 py-2">
            <option>Status: All</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search reg. no..."
            className="rounded border border-gray-700 bg-[#111] px-3 py-2"
          />

          <button className="ml-auto rounded bg-orange-600 px-5 py-2">
            + Add Vehicle
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="py-3 text-left">
                REG. NO.
              </th>
              <th className="text-left">
                NAME/MODEL
              </th>
              <th className="text-left">
                TYPE
              </th>
              <th className="text-left">
                CAPACITY
              </th>
              <th className="text-left">
                ODOMETER
              </th>
              <th className="text-left">
                ACQ. COST
              </th>
              <th className="text-left">
                STATUS
              </th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-b border-gray-800"
              >
                <td className="py-3">
                  {vehicle.regNo}
                </td>
                <td>{vehicle.name}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.odometer}</td>
                <td>{vehicle.cost}</td>
                <td>
                  <span
                    className={`rounded px-3 py-1 text-xs font-semibold ${badgeColor(
                      vehicle.status
                    )}`}
                  >
                    {vehicle.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-4 text-sm text-orange-400">
          Rule: Registration No. must be unique.
          Retired/In Shop vehicles are hidden
          from Trip Dispatcher.
        </p>
      </div>
    </div>
  );
}