
export const getStockPrice = async (ticker:string) => {

    try {
        fetch('http://localhost:3001/api/yahoo/AVUV') // example ticker
      .then((res) => res.text())
      .then((html) => {
        console.log(html);
      })
      .catch((err) => {
        console.error('Error:', err);
      });

        
    }catch (err) {
        console.error("Unexpected error:", err);
        return null;
    }

}