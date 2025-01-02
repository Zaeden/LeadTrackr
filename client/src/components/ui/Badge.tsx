const Badge = ({ text, status }: { text: string; status: string }) => {
  return (
    <span
      className={`px-2 border rounded-full text-xs font-semibold ${
        status === "success"
          ? "border-green-500 bg-green-100 text-green-500"
          : "border-red-500 bg-red-100 text-red-500"
      }`}
    >
      {text}
    </span>
  );
};

export default Badge;
