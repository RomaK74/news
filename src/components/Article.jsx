import React from 'react';

export const Article = ({id, title, link, date, content}) => {
    function strip(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText;
    }

    return (
        <div key={id} className="article">
            <div className="article__title"><a href={link}>{strip(title.rendered)}</a></div>
            <div className="article__text">{strip(content.rendered).split('.')[0]}.</div>
            <div className="article__date">{date.replace('T', ' ').replaceAll('-', '.')}</div>
        </div>);
}