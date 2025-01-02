const LeadStatusBadge = ({
  text,
  status,
}: {
  text: string;
  status:
    | "NEW"
    | "CONTACTED"
    | "QUALIFIED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "LOST";
}) => {
  const statusStyles = {
    NEW: "border-blue-500 bg-blue-100 text-blue-500",
    CONTACTED: "border-yellow-500 bg-yellow-100 text-yellow-500",
    QUALIFIED: "border-purple-500 bg-purple-100 text-purple-500",
    IN_PROGRESS: "border-orange-500 bg-orange-100 text-orange-500",
    COMPLETED: "border-green-500 bg-green-100 text-green-500",
    LOST: "border-red-500 bg-red-100 text-red-500",
  };

  return (
    <span
      className={`px-2 border rounded-full text-xs font-semibold ${statusStyles[status]}`}
    >
      {text[0] + text.substring(1).toLowerCase()}
    </span>
  );
};

export default LeadStatusBadge;
