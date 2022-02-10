import React from 'react';
import axios from "axios";
import './index.css';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    React.useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay]
    );
    return debouncedValue;
}

function App() {
    const [articles, setArticles] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [activePage, setActivePage] = React.useState(1);
    const debouncedSearchTerm = useDebounce(searchValue, 500);
    const pages = [1, 2, 3, 4, 5];

    React.useEffect(() => {
        setArticles([]);
        search();
    }, [activePage]);

    React.useEffect(() => {
        if (searchValue)
            checkValue();
        else
            getArticles();
    }, [debouncedSearchTerm]);

    const checkValue = () => {
        if (searchValue) {
            search();
        }
    };

    const getArticles = async () => {
        //const a = await axios.get('https://www.zhukvesti.ru/wp-json/wp/v2/posts');
        //const q = a.headers['x-wp-totalpages'];
        const {data} = await axios.get(`https://www.zhukvesti.ru/wp-json/wp/v2/posts?page=${activePage}&per_page=10`);
        console.log(data);
        await setArticles([...data]);
    }

    const changeInput = (e) => {
        setSearchValue(e);
    }

    const search = async () => {
        const {data} = await axios.get(`https://www.zhukvesti.ru/wp-json/wp/v2/posts?page=${activePage}&per_page=10&search=${searchValue}`);
        console.log(data);
        setArticles([]);
        await setArticles(articles => [...articles, ...data]);
    }

    // const short = (text) => {
    //     var allWords = text.split(/\b/);
    //     var wordCountList = {};
    //
    //     allWords.forEach(function (word) {
    //         if (word !== " ") {
    //             if (!wordCountList.hasOwnProperty(word)) {
    //                 wordCountList[word] = {word: word, count: 0};
    //             }
    //             wordCountList[word].count++;
    //         }
    //     })
    //
    //
    //     var maxCountWord = {count: 0};
    //     for (var propName in wordCountList) {
    //         var currentWord = wordCountList[propName];
    //         if (maxCountWord.count < currentWord.count) {
    //             maxCountWord = currentWord;
    //         }
    //     }
    //     console.info(maxCountWord);
    //     return 0;
    // }

    function strip(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText;
    }

    // function shazam(str) {
    //     str = str.replace(/[^а-яА-ЯёЁ ]/g, ''); // удалил все символы кроме букв и пробелов
    //     str = str.replace(/  +/g, ' ').trim().toLowerCase(); // удалил двойные пробелы и пробелы по краям, сделал нижний регистр
    //     let arr = str.split(' ');
    //     let obj = {};
    //     arr.forEach(function (item) {
    //         item in obj ? obj[item]++ : obj[item] = 1;
    //     });
    // }

    return (
        <div className="App">
            <div className="search">
                <input type="text"
                       value={searchValue}
                       onChange={(e) => changeInput(e.target.value)}
                       placeholder="Поиск..."/>
                <button onClick={search}>Поиск</button>
            </div>
            {articles && articles.map(article => (
                <div key={article.id} className="article">
                    <div className="article__title"><a href={article.link}>{strip(article.title.rendered)}</a></div>
                    <div className="article__date">{article.date.replace('T', ' ')}</div>
                    <div className="article__text">{strip(article.content.rendered).split('.')[0]}.</div>
                </div>)
            )}
            <div className="pages">
                {pages.map(page =>
                    <div key={page}
                         className={page !== activePage ? "page" : "page active"}
                         onClick={() => setActivePage(page)}>
                        {page}
                    </div>)}
            </div>
        </div>
    );
}

export default App;
