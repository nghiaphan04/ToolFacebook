"use client";
import { Button, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetComment = () => {
    const [inputId, setInputId] = useState<string>("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    interface Comment {
        author: {
            id: string;
        };
    }

    // Gọi API lấy comment
    const fetchComments = async (postId: string, nextCursor: string | null = null) => {
        try {
            const url = `https://facebook-scraper3.p.rapidapi.com/post/comments?post_id=${postId}${nextCursor ? `&cursor=${nextCursor}` : ""}`;
            const options = {
                method: "GET",
                url: url,
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

        setLoading(true);
        setComments([]);
        setCursor(null);

        const data = await fetchComments(inputId);
        if (data && data.results) {
            setComments(data.results);
            setCursor(data.cursor || null);
            toast.success("Lấy comment thành công!");
        }

        setLoading(false);
    };

   
    const handleLoadMore = async () => {
        if (!cursor) return;

        setLoadingMore(true);
        const data = await fetchComments(inputId, cursor);
        if (data && data.results) {
            setComments(prev => [...prev, ...data.results]);
            setCursor(data.cursor || null);
        }
        setLoadingMore(false);
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
        <div className=" mx-auto bg-white row">
            <div className="card mx-auto mt-lg-2 col-lg-3 ">
                <div className="card-header bg-white fw-bold py-3">
                    📌 Công cụ lấy comment Facebook miễn phí.
                </div>
                <div className="card-body pt-4">
                    <h6 className="card-subtitle mb-2 text-muted">Nhập ID bài viết:</h6>
                    <div className="input-group mb-3 py-3">
                        <input
                            onChange={(e) => setInputId(e.target.value)}
                            value={inputId}
                            type="text"
                            className="form-control"
                            placeholder="Nhập ID bài viết Facebook"
                            disabled={loading}
                        />
                    </div>
                    <Button 
                        className="py-2 w-100" 
                        onClick={handleGetComment} 
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : "Lấy comment"}
                    </Button>
                </div>

               
            </div>
            <div className="col-lg-9 bg-white py-3">
                    <h6>
                        Danh sách ID user comment ({comments.length}): 
                    </h6>
                    {comments.length > 0 && (
                        <Button 
                            className="mb-3 w-100" 
                            variant="success" 
                            onClick={handleCopyAll}
                        >
                            📋 Copy Tất Cả ID
                        </Button>
                    )}

                    <div style={{ maxHeight: "360px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px", padding: "10px"}}>
                        <ul className="p-0" style={{ listStyle: "none" }}>
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <li 
                                        key={index} 
                                        className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
                                    >
                                        <span>{comment.author.id}</span>
                                    </li>
                                ))
                            ) : (
                                <p>Không có comment nào.</p>
                            )}
                        </ul>
                    </div>

                   
                    {cursor && (
                        <Button 
                            className="mt-3 w-100" 
                            variant="secondary" 
                            onClick={handleLoadMore} 
                            disabled={loadingMore}
                        >
                            {loadingMore ? <Spinner animation="border" size="sm" /> : "Tải thêm comment"}
                        </Button>
                    )}
                </div>
        </div>
    );
};

export default GetComment;
