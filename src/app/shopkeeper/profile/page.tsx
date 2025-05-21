import ShopLayout from "@/Layout/shopkeeper/ShopLayout";
import { FaUserCircle } from "react-icons/fa";

const Page = () => {
  return (
    <ShopLayout>
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-yellow-50 to-white px-4 text-center">
        <FaUserCircle className="text-yellow-500 text-[80px] mb-4 animate-bounce" />
        <h1 className="text-4xl font-extrabold text-yellow-700 mb-2 drop-shadow-sm">Profile Page</h1>
        <p className="text-lg text-gray-700 mb-1 max-w-md">
          Your profile is being prepared with awesome features!
        </p>
        <p className="text-md text-gray-500 mb-6">Stay tuned for updates.</p>
        <span className="text-xl font-semibold text-yellow-600 animate-pulse">
          🚧 Coming Soon...
        </span>
      </div>
    </ShopLayout>
  );
};

export default Page;
