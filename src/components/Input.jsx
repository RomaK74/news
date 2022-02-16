import React from 'react';

export const Input = ({searchValue, changeInput, search}) => (
        <div className="search">
            <input type="text"
                   value={searchValue}
                   onChange={(e) => changeInput(e.target.value)}
                   placeholder="Поиск..."/>
            <button onClick={search}>Поиск</button>
        </div>);
