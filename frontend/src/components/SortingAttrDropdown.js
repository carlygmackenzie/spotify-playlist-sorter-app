// https://www.freecodecamp.org/news/build-a-dynamic-dropdown-component/

import { createContext, useRef, useState, useContext } from "react";
import { FiChevronDown } from "react-icons/fi";
import useClickOutside from "./UseClickOutside";

const SortingAttrContext = createContext();
const SortingAttrDropdown = ({
    children,
    sortingAttr,
    setSortingAttr,
    attributes,
}) => {
    
    const SortingAttrDropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useClickOutside(SortingAttrDropdownRef, () => {
        setIsDropdownOpen(false);
    });

    return (
        <SortingAttrContext.Provider
            value={{
                sortingAttr,
                attributes,
                SortingAttrDropdownRef,
                isDropdownOpen,
                setIsDropdownOpen,
                setSortingAttr,
            }}>
            <div ref={SortingAttrDropdownRef}>{children}</div>
        </SortingAttrContext.Provider>
    );
};

const Item = ({ attribute }) => {
    const { setSortingAttr } = useContext(SortingAttrContext);
    const handleChoice = (attribute) => {
        setSortingAttr(attribute);
    }

    return(
        <li
            key={attribute.id}
            className={`flex items-center gap-2 p-2 hover:bg-[#2b2c37] rounded transition-all duration-200`}
            onClick={() => handleChoice(attribute)}>
            <span>{attribute.name}</span>
        </li>
    );
};

const Button = () => {
    const { isDropdownOpen, setIsDropdownOpen, sortingAttr } = useContext(SortingAttrContext);
    return (
        <button
            className="  px-4 w-full py-2 flex items-center justify-between rounded border border-[#828FA340] hover:border-primary cursor-pointer relative "
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
            <span className="block">
                {sortingAttr.name}
                <FiChevronDown color="#635FC7" size={24} />
            </span>
            <SortingAttrDropdown.List/>
        </button>
    );
};

const ListContainer = () => {
    const { attributes, isDropdownOpen } = useContext(SortingAttrContext);

    return (
        isDropdownOpen && (
            <ul
                className="absolute bottom-full translate-x-9 left-full translate-y-full rounded bg-[#20212c] w-max">
                <div className="flex flex-col p-2">
                    {attributes?.map((attribute, index) => (
                        <SortingAttrDropdown.Item key={index} attribute={attribute} />
                    ))}
                </div>
            </ul>
        )
    )
}

SortingAttrDropdown.List = ListContainer;
SortingAttrDropdown.Item = Item;
SortingAttrDropdown.Button = Button;


export default SortingAttrDropdown;