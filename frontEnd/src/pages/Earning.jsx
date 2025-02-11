import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios';

const Earning = () => {

    const {backEndURL, token, currency} = useContext(ShopContext)
    const [earningData, setEarningData] = useState([]);

    const loadEarningData = async() => {
        try {
            if(!token){
                return null;
            }
            const response = await axios.post(backEndURL + '/api/order/my_earning', {}, {headers: {token}});
            if (response.data.success) {
                let allOrderEarning = [];
                response.data.earnings.map((earning) => {
                    earning.items.map((item) => {
                        item['']
                    })
                })
            }
        } catch (error) {
            
        }
    }
  return (
    <div className='border-t pt-24 bg-gray-50'>
        <div className='text-2xl text-center font-semibold text-gray-800'>
            <Title text1={'MY'} text2={'Earning'}/>
        </div>

        <div className=' mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-5'>

        </div>
        
    </div>
  )
}

export default Earning