// https://www.freecodecamp.org/news/build-a-dynamic-dropdown-component/

import { createContext, useRef, useState, useContext } from "react";
import { FiChevronDown } from "react-icons/fi";
import useClickOutside from "./UseClickOutside";
import "../styles/SortPlaylist.css";

const DropdownContext = createContext();
const Dropdown = ({
    children,
    choice,
    setChoice,
    options,
}) => {
    
    const DropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useClickOutside(DropdownRef, () => {
        setIsDropdownOpen(false);
    });

    return (
        <DropdownContext.Provider
            value={{
                choice,
                options,
                DropdownRef,
                isDropdownOpen,
                setIsDropdownOpen,
                setChoice,
            }}>
            <div ref={DropdownRef}>{children}</div>
        </DropdownContext.Provider>
    );
};

const Item = ({ choice }) => {
    const { setChoice } = useContext(DropdownContext);
    const handleChoice = (choice) => {
        setChoice(choice);
    }

    return(
        <li
            key={choice.id}
            className="dropdown-options-list"
            onClick={() => handleChoice(choice)}>
            <span>{choice.name}</span>
        </li>
    );
};

const Button = () => {
    const { isDropdownOpen, setIsDropdownOpen, choice } = useContext(DropdownContext);
    return (
        <div>
            <button
                className='dropdown'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span className='dropdown-text'>
                    {choice.name}
                </span>
                <FiChevronDown className='dropdown-icon'/>
                <Dropdown.List/>

            </button>
        </div>
    );
};

const ListContainer = () => {
    const { options, isDropdownOpen } = useContext(DropdownContext);

    return (
        isDropdownOpen && (
            <ul
                className="dropdown-options-box">
                <div className="dropdown-options-content">
                    {options?.map((choice, index) => (
                        <Dropdown.Item key={index} choice={choice} />
                    ))}
                </div>
            </ul>
        )
    )
}

Dropdown.List = ListContainer;
Dropdown.Item = Item;
Dropdown.Button = Button;


export default Dropdown;