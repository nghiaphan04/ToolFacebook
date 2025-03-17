import axios from "axios";

const getIdByUrl = async (url: string) => {
    try {
        const options = {
            method: "GET", 
            url: `${url}`,
            headers: {
                "x-rapidapi-key": "11346e5537msh5921e328f482712p1715f3jsnd5108e6aa4b9",
                "x-rapidapi-host": "facebook-scraper3.p.rapidapi.com"
            }
        };
        const response = await axios.request(options);
        console.log("Phản hồi từ API:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        throw error;
    }
};

export default getIdByUrl;
