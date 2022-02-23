import React from 'react';
import axios from "axios";
import './index.css';
import {Article} from "./components/Article";
import Pagination from "./components/Pagination";
import {Input} from "./components/Input";
import {Loader} from "./components/Loader/Loader";

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
    const [loading, setLoading] = React.useState(false);
    const [numberOfPages, setNumberOfPages] = React.useState([]);

    React.useEffect(() => {
        setArticles([]);
        search();
    }, [activePage]);

    React.useEffect(() => {
        const numbers = [];
        for (let i = 1; i <= countPages; i++) {
            numbers.push(i);
        }
        setNumberOfPages([...numbers])
    }, [countPages])

    React.useEffect(() => {
    }, [searchValue]);

    React.useEffect(() => {
        if (searchValue)
            checkValue();
        else {
            search();
        }
    }, [debouncedSearchTerm]);

    const checkValue = () => {
        if (searchValue) {
            search();
            setActivePage(1);
        }
    };

    const clearInput = () => {
        setSearchValue('');
    }

    const changeInput = (e) => {
        setSearchValue(e);
    }

    const search = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://www.zhukvesti.ru/wp-json/wp/v2/posts?page=${activePage}&per_page=10&search=${searchValue}`);
            setCountPages(Number(res.headers['x-wp-totalpages']));
            setArticles([]);
            setArticles(articles => [...articles, ...res.data]);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="App">
            <Input searchValue={searchValue}
                   changeInput={changeInput}
                   clearInput={clearInput}
                   search={search}/>
            {loading ? <Loader/> : articles.map(article => (
                <Article key={article.id} {...article}/>)
            )}
            {(!articles.length && !loading) && <div className="nothing">Ничего не найдено</div>}
            {countPages ?
                <Pagination
                    numberOfPages={numberOfPages}
                    setCurrentButton={setActivePage}
                    currentButton={activePage}/> : ""}
        </div>
    );
}

export default App;
