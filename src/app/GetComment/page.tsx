"use client";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetComment = () => {
    const [inputId, setInputId] = useState(""); 
    const [comments, setComments] = useState<any[]>([]);

    // Hàm gọi API lấy comment
    const getCommentByUrl = async (id: string) => {
        try {
            const options = {
                method: "GET",
                url: `https://facebook-scraper3.p.rapidapi.com/post/comments?post_id=${id}`,
                headers: {
                    "x-rapidapi-key": "11346e5537msh5921e328f482712p1715f3jsnd5108e6aa4b9",
                    "x-rapidapi-host": "facebook-scraper3.p.rapidapi.com",
                },
            };
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            toast.error("Lỗi khi gửi yêu cầu, vui lòng thử lại!");
            return null;
        }
    };

    const handleGetComment = async () => {
        if (!inputId) {
            toast.error("Vui lòng nhập ID bài viết!");
            return;
        }

        const data = await getCommentByUrl(inputId);
        if (data) {
            setComments(data.results || []);  
            toast.success("Lấy comment thành công!");
        }
    };

    const handleCopy = async (text: string) => {
        try {
            const previousText = await navigator.clipboard.readText();
            let newText;

            if (previousText.includes("\n")) {
                // Nếu clipboard đã chứa danh sách trước đó → Reset lại
                newText = text;
            } else {
                // Nếu clipboard chưa có danh sách trước đó → Tiếp tục nối chuỗi
                newText = previousText ? `${previousText}\n${text}` : text;
            }

            await navigator.clipboard.writeText(newText);
            toast.success("Đã sao chép thành công!");
        } catch (err) {
            toast.error("Lỗi khi sao chép!");
            console.error(err);
        }
    };

    const handleCopyAll = async () => {
        try {
            const allIds = comments.map(comment => comment.author.id).join("\n");
            await navigator.clipboard.writeText(allIds);
            toast.success("Đã sao chép toàn bộ ID thành công!");
        } catch (err) {
            toast.error("Lỗi khi sao chép!");
            console.error(err);
        }
    };

    useEffect(() => {
        console.log("Comments đã cập nhật:", comments);
    }, [comments]);

    return (
        <div className="col-lg-8 mx-auto bg-white">
            <div className="card mx-auto mt-lg-2">
                <div className="card-header bg-white fw-bold py-3">
                    Công cụ miễn phí giúp bạn dễ dàng lấy comment Facebook một cách dễ dàng.
                </div>
                <div className="card-body pt-4">
                    <h6 className="card-subtitle mb-2 text-muted">Id Post</h6>
                    <div className="input-group mb-3 py-3">
                        <input
                            onChange={(e) => setInputId(e.target.value)}
                            value={inputId}
                            type="text"
                            className="form-control"
                            placeholder="Nhập ID bài viết Facebook"
                        />
                    </div>
                    <Button className="py-2 w-100" onClick={handleGetComment}>
                        Lấy comment
                    </Button>
                </div>
                <div className="card-footer bg-white py-3">
                    <h6>Danh sách ID user comment:</h6>
                    {comments.length > 0 && (
                        <Button 
                            className="mb-3 w-100" 
                            variant="success" 
                            onClick={handleCopyAll}
                        >
                            Copy Tất Cả ID
                        </Button>
                    )}
                    <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px", padding: "10px"}}>
                        <ul className="p-0" style={{ listStyle: "none" }}>
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <li 
                                        key={index} 
                                        className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
                                    >
                                        <span>{comment.author.id}</span>
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            onClick={() => handleCopy(comment.author.id)}
                                        >
                                            Copy
                                        </Button>
                                    </li>
                                ))
                            ) : (
                                <p>Không có comment nào.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetComment;
