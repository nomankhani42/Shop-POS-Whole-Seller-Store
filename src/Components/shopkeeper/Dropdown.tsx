import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

interface DropdownProps {
  dropdownList: string[];
  handleSelect: (status: string, item: any) => void;
  data: any;
  disabled?: boolean;
  label?:string
}

const Dropdown = ({ dropdownList, handleSelect, data, disabled = false,label }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        disabled={disabled}
        className={`p-2 border flex items-center justify-between rounded-md min-w-[120px] transition-colors ${
          disabled
            ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
            : 'bg-white border-yellow-600 text-black cursor-pointer'
        }`}
        type="button"
      >
        {label=="received_partially"?"Received Partially":"Pending"} {isOpen ? <FaCaretUp /> : <FaCaretDown />}
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-white w-[180px] overflow-auto z-20 shadow-lg rounded-md mt-2"
          >
            <ul className="p-2">
              {dropdownList.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    handleSelect(item, data);
                    toggle();
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
