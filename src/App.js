import React from 'react';
import axios from "axios";
import './index.css';
import {Article} from "./components/Article";
import Pagination from "./components/Pagination";
import {Input} from "./components/Input";

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
    const [countPages, setCountPages] = React.useState(0);

    React.useEffect(() => {
        setArticles([]);
        search();
    }, [activePage]);

    React.useEffect(() => {
        if (searchValue)
            checkValue();
        else
            search();
    }, [debouncedSearchTerm]);

    const checkValue = () => {
        if (searchValue) {
            search();
        }
    };

    // const getArticles = async () => {
    //     const a = await axios.get('https://www.zhukvesti.ru/wp-json/wp/v2/posts');
    //     setCountArticles(Number(a.headers['x-wp-totalpages']));
    //     console.log('hfhgjrfj' + countArticles)
    //     const {data} = await axios.get(`https://www.zhukvesti.ru/wp-json/wp/v2/posts?page=${activePage}&per_page=10`);
    //     console.log(data);
    //     await setArticles([...data]);
    // }

    const changeInput = (e) => {
        setSearchValue(e);
    }

    const search = async () => {
        try {
            const res = await axios.get(`https://www.zhukvesti.ru/wp-json/wp/v2/posts?page=${activePage}&per_page=10&search=${searchValue}`);
            setCountPages(Number(res.headers['x-wp-totalpages']));
            setArticles([]);
            setArticles(articles => [...articles, ...res.data]);
        } catch (e) {
            console.log(e);
            alert('Ошибка запроса')
        }
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
            <Input searchValue={searchValue}
                   changeInput={changeInput}
                   search={search}/>
            {articles && articles.map(article => (
                <Article key={article.id} {...article}/>)
            )}
            {countPages ?
                <Pagination pages={countPages}
                            setCurrentPage={setActivePage}/> : "Постов по такому запросу не найдено"}
        </div>
    );
}

export default App;
