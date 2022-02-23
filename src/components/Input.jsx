import React from 'react';
import Search from "../images/magnifying-glass.png";
import Clear from "../images/close.png";

export const Input = ({searchValue, changeInput, clearInput, search}) => (
        <div className="search">
            <img src={Search} className="img-search" alt="search"/>
            {searchValue && <img onClick={clearInput} src={Clear} className="img-clear" alt="search"/>}
            <input type="text"
                   className="input-text"
                   value={searchValue}
                   onChange={(e) => changeInput(e.target.value)}
                   placeholder="Поиск..."/>
            <button onClick={search} className="custom-btn btn-1">Поиск</button>
        </div>);
