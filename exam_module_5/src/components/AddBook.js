import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { format } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddBook = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Yêu cầu nhập tiêu đề')
            .min(3, 'Title phải chứa ít nhất 3 ký tự')
        .max(100,'Tiêu đề không quá 100 ký tự'),
        quantity: Yup.number()
            .required('Yêu cầu nhập số lượng')
            .min(1, 'Số lượng ít nhất 1')
            .integer('Số lượng là số nguyên lớn hơn 0'),
        categoryId: Yup.string()
            .required('Yêu cầu nhập thể loại'),
        importDay: Yup.date()
            .required('Yêu cầu nhập ngày')
        .max(new Date(), 'Ngày không được vượt quá ngày hiện tại'),
        bookCode: Yup.string()
            .matches(/^BO-\d{4}$/, 'Sách phải nhập theo dạng BO-XXXX')
            .required('Yêu cầu nhập mã sách')
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            quantity: '',
            categoryId: '',
            importDay: '',
            bookCode: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formattedValues = {
                    ...values,
                    importDay: format(new Date(values.importDay), 'dd/MM/yyyy'),
                    id: values.bookCode
                };

                await axios.post('http://localhost:8080/books', formattedValues);
                alert('Thêm sách thành công');
                navigate('/');
            } catch (error) {
                console.error("Lỗi:", error);
            }
        },
    });

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="w-50 p-4 border rounded bg-light shadow">
                <h1 className="text-center mb-4">Add a New Book</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="bookCode" className="form-label">Book Code</label>
                        <input
                            type="text"
                            name="bookCode"
                            className="form-control"
                            value={formik.values.bookCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập mã sách theo dạng BO-XXXX (ví dụ: BO-1234)"
                        />
                        {formik.touched.bookCode && formik.errors.bookCode && (
                            <div className="text-danger">{formik.errors.bookCode}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter book title"
                        />
                        {formik.touched.title && formik.errors.title && (
                            <div className="text-danger">{formik.errors.title}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            className="form-control"
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter quantity"
                        />
                        {formik.touched.quantity && formik.errors.quantity && (
                            <div className="text-danger">{formik.errors.quantity}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="categoryId" className="form-label">Category</label>
                        <select
                            name="categoryId"
                            className="form-select"
                            value={formik.values.categoryId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.categoryId && formik.errors.categoryId && (
                            <div className="text-danger">{formik.errors.categoryId}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="importDay" className="form-label">Date Added</label>
                        <input
                            type="date"
                            name="importDay"
                            className="form-control"
                            value={formik.values.importDay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.importDay && formik.errors.importDay && (
                            <div className="text-danger">{formik.errors.importDay}</div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Add</button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
