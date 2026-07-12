export default function StatusBadge({ status }) {
  const styles = {
    Available: "bg-green-500 text-black",
    "On Trip": "bg-blue-500 text-black",
    "Off Duty": "bg-gray-400 text-black",
    Suspended: "bg-orange-500 text-black",

    active: "bg-green-500 text-black",
    inactive: "bg-red-500 text-black",
    pending: "bg-yellow-500 text-black",
  };

  return (
    <span
      className={`px-3 py-1 rounded-md text-xs font-semibold ${
        styles[status] || "bg-gray-500 text-white"
      }`}
    >
      {status}
    </span>
  );
}