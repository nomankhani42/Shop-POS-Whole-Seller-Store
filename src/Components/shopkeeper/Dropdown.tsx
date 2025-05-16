import { AnimatePresence,motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

interface DropdownProps {
  dropdownList: string[];
}

 const Dropdown = ({ dropdownList }: DropdownProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  }
  return (
    <div className="relative">
      <button onClick={toggle} className=" p-2 border flex items-center justify-between border-yellow-600 rounded-md">
        Pending  {isOpen ? <FaCaretUp /> : <FaCaretDown />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-white w-[180px] overflow-auto z-20 shadow-lg rounded-md mt-2"
          >
            <ul className="p-2">
              {dropdownList.map((item, index) => (
                <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;

