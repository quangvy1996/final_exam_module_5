import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredBooks, setFilteredBooks] = useState([]);
    const navigate = useNavigate();

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/books');
            const sortedBooks = response.data.sort((a, b) => a.quantity - b.quantity);
            setBooks(sortedBooks);
            setFilteredBooks(sortedBooks);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await axios.get('http://localhost:8080/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            await fetchBooks();
            await fetchCategory();
        }
        fetchData();
    }, [navigate]);

    const handleSearch = () => {
        const filtered = books.filter((book) => {
            const matchesTitle = book.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "" || book.categoryId === selectedCategory;
            return matchesTitle && matchesCategory;
        });
        setFilteredBooks(filtered);
    };
    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Library</h1>
            <div className="d-flex justify-content-between mb-3">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="form-select w-25 ms-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button className="btn btn-secondary ms-2" onClick={handleSearch}>
                    Search
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/add')}>
                    Add a new Book
                </button>
            </div>
            {filteredBooks.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                    <tr>
                        <th>Book ID</th>
                        <th>Title</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Category Description</th>
                        <th>Date Added</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBooks.map((book) => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.quantity}</td>
                            <td>{categories.find(category => category.id === book.categoryId)?.name || "N/A"}</td>
                            <td>{categories.find(category => category.id === book.categoryId)?.description || "N/A"}</td>
                            <td>
                                {book.importDay
                                    ? new Date(book.importDay.split('/').reverse().join('-')).toLocaleDateString('en-GB')
                                    : "N/A"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center mt-4">Không tìm thấy sách phù hợp.</p>
            )}
        </div>
    );
};

export default BookList;
