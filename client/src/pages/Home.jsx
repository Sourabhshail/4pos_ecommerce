import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Heders from '../components/Headers'
import Banner from '../components/Banner'
import Categorys from '../components/Categorys'
import FeatureProducts from '../components/products/FeatureProducts'
import Products from '../components/products/Products'
import Footer from '../components/Footer'
import { get_category, get_products } from '../store/reducers/homeReducer'
const Home = ({sellerId}) => {
    const dispatch = useDispatch()
    const {products, latest_product, topRated_product, discount_product } = useSelector(state => state.home)
      const { userInfo } = useSelector((state) => state.auth);
    useEffect(() => {
        console.log("fetching category", userInfo);
        dispatch(get_products(sellerId))
    }, [])

     useEffect(() => {
       console.log("fetching category13", userInfo);
     });

    
    return (
        <div className='w-full'>
            <Heders sellerId={sellerId} />
            <Banner sellerId={sellerId} />
            <div className='my-4'>
                <Categorys sellerId={sellerId}/>
            </div>
            <div className='py-[45px]'>
                <FeatureProducts products={products} sellerId={sellerId}/>
            </div>
            <div className='py-10'>
                <div className='w-[85%] flex flex-wrap mx-auto'>
                    <div className="grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7">
                        <div className='overflow-hidden'>
                            <Products title='Latest Product' products={latest_product} sellerId={sellerId}  />
                        </div>
                        <div className='overflow-hidden'>
                            <Products title='Top Rated Product' products={topRated_product} sellerId={sellerId}/>
                        </div>
                        <div className='overflow-hidden'>
                            <Products title='Discount Product' products={discount_product} sellerId={sellerId} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer sellerId={sellerId}/>
        </div>
    )
}

export default Home