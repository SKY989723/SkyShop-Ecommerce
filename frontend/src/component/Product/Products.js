import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import {useSelector, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {clearErrors, getProduct} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import {useAlert} from "react-alert";
import MetaData from "../layout/MetaData";

const Products = () => {

    const dispatch = useDispatch();
    const alert = useAlert();

    // const categories= [
    //     "Laptop",
    //     "Footwear",
    //     "Bottom",
    //     "Tops",
    //     "Attire",
    //     "Camera",
    //     "SmartPhones"
    // ];

    const [currentPage, setCurrentPage] = useState(1);
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }
 
    const [price, setPrice] = useState([0,2500000]);
    const priceHandler = (e, newPrice) => {
        setPrice(newPrice);
    }

    const [category, setCategory] = useState("");

    const [ratings, setRatings] = useState(0);

    const params = useParams();

    const {products,loading,error,productsCount, resultPerPage, filteredProductsCount} = useSelector(state => state.products);

    const keyword = params.keyword;

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(keyword,currentPage,price,category,ratings));
    },[dispatch,keyword,currentPage,price,category,ratings,alert,error])

    let count = filteredProductsCount;

    return(
        <div>
            <Fragment>
                <MetaData  title="PRODUCTS -- SkyShop"/>
                {loading ? (
                    <Loader />
                ) : (
                    <Fragment>
                        <h2 className="productsHeading">Products</h2>
                        <div className="products">
                            {products && products.map((product) => (
                                <ProductCard  key={product._id} product={product}/>
                            ))}
                        </div>
                        <div className="productsFiltering">
                            <div className="filterBox">
                                <p>Price</p>
                                <Slider 
                                    value={price}
                                    onChange={priceHandler}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                    min={0}
                                    max={2500000}
                                />
                            </div>
                            <div className="categorySection">
                                <p>Categories</p>
                                <ul className="categoryBox">
                                    {products && products.map((product,index) => {
                                        const categoryExists = products.slice(0,index).some(item => item.category === product.category);
                                        if(categoryExists){
                                            return null;
                                        }
                                        return <li 
                                            key={index}
                                            className="category-link"
                                            onClick={() => setCategory(product.category)}
                                        >
                                            {product.category}
                                        </li>
                                    })}
                                </ul>
                                <fieldset>
                                    <legend>Ratings Above</legend>
                                    <Slider
                                        value={ratings}
                                        onChange={(e,newRating) => {
                                            setRatings(newRating);
                                        }}
                                        aria-labelledby="continuous-slider"
                                        min={0}
                                        max={5}
                                        valueLabelDisplay="auto"
                                    />
                                </fieldset>
                            </div>
                        </div>
                        {resultPerPage < count && (
                            <div className="paginationBox">
                            <Pagination 
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                                activeClass="pageItemActive"
                                activeLinkClass="pageLinkActive"
                            />  
                        </div>
                        )}
                    </Fragment>
                )}
            </Fragment>
        </div>
    );
}

export default Products;