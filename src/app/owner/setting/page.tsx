import OwnerLayout from "@/Layout/owner/OwnerLayout";
import { FaTools, FaHardHat } from "react-icons/fa";

const Page = () => {
  return (
    <OwnerLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-yellow-50 px-4 py-10">
        <div className="text-center bg-white p-10 rounded-2xl shadow-2xl border border-yellow-100 max-w-xl">
          <div className="flex justify-center mb-4 text-yellow-600">
            <FaHardHat className="text-5xl animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-yellow-700 mb-2">Settings Page Under Construction</h1>
          <p className="text-gray-600 text-base mb-6">
            We're currently working on this page to bring you new features and configuration options.
            Please check back soon!
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-500 font-semibold">
            <FaTools className="animate-spin" />
            <span>Building features for better control...</span>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default Page;
