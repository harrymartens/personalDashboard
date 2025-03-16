import { getStockPrice } from "@/api/stockData"
import { useEffect, useState } from "react"

export default function FinanceWidget(){
    const [stockPrice, setStockPrice] = useState(0);

    useEffect(()=> {
        const fetchStockPrice = async() => {
            try{
                const response = await getStockPrice("AVUV");
                if(response){
                    setStockPrice(response)
                }
            }
            catch (err) {
                console.error("Error fetching sleep duration:", err);
              }

        }

        fetchStockPrice()
    },[])

    return(
        <>
        <p>Finance</p>
        </>
    )
}