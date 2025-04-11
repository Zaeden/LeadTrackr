import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { username } = useAuth();

  return (
    <nav className="h-16 bg-white shadow flex items-center justify-between px-6">
      <div className="ml-auto flex items-center space-x-3">
        <span className="text-gray-600 font-medium">Hi, {username}</span>
        {/* <img
          src={""}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-purple-500"
        /> */}
      </div>
    </nav>
  );
};

export default Navbar;
