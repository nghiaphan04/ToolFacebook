"use client";

import { Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Post {
  author: {
    id: string;
    name: string;
    url: string;
  };
  message: string;
  post_id: string;
  url: string;
  timestamp: number;
  comments_count: number;
  reactions: {
    angry: number;
    care: number;
    haha: number;
    like: number;
    love: number;
    [key: string]: number;
  };
}

const GetPostPage = () => {
  const [pageLink, setPageLink] = useState("");
  const [postNumber, setPostNumber] = useState<string>("3");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPageIdFromLink = async (link: string): Promise<string | null> => {
    try {
      const response = await axios.request({
        method: "GET",
        url: "https://facebook-scraper3.p.rapidapi.com/page/page_id",
        params: { url: link },
        headers: {
          "x-rapidapi-key": "11346e5537msh5921e328f482712p1715f3jsnd5108e6aa4b9",
          "x-rapidapi-host": "facebook-scraper3.p.rapidapi.com",
        },
      });
      console.log("Page ID:", response.data);
      return response.data?.page_id || null;
    } catch (error) {
      console.error("Lỗi lấy Page ID:", error);
      toast.error("Không thể lấy Page ID từ link. Kiểm tra lại link.");
      return null;
    }
  };

  const fetchPagePostsWithCursor = async (
    pageId: string,
    cursor: string | null = null
  ): Promise<{ posts: Post[]; cursor: string | null }> => {
    try {
      const options = {
        method: "GET",
        url: "https://facebook-scraper3.p.rapidapi.com/page/posts",
        params: {
          page_id: pageId,
          ...(cursor ? { cursor } : {}),
        },
        headers: {
          "x-rapidapi-key": "11346e5537msh5921e328f482712p1715f3jsnd5108e6aa4b9",
          "x-rapidapi-host": "facebook-scraper3.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      const fetchedPosts = response.data.results || [];
      const nextCursor = response.data.cursor || null;

      return {
        posts: fetchedPosts,
        cursor: nextCursor,
      };
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      toast.error("Lỗi khi gửi yêu cầu, vui lòng thử lại!");
      return {
        posts: [],
        cursor: null,
      };
    }
  };

  const handleGetPosts = async () => {
    if (!pageLink) {
      toast.warning("Vui lòng nhập link trang Facebook.");
      return;
    }

    setLoading(true);
    const id = await fetchPageIdFromLink(pageLink.trim());
    if (!id) {
      setLoading(false);
      return;
    }

    let allPosts: Post[] = [];
    let cursor: string | null = null;
    const targetCount = Number(postNumber);

    try {
      while (allPosts.length < targetCount) {
        const { posts: fetched, cursor: nextCursor } = await fetchPagePostsWithCursor(id, cursor);

        if (fetched.length === 0) break;

        allPosts = [...allPosts, ...fetched];
        cursor = nextCursor;

        if (!cursor) break;
      }

      setPosts(allPosts.slice(0, targetCount));
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lấy bài viết." + error);
    }

    setLoading(false);
    setPostNumber("3");
    setPageLink("");
  };

  const handleDownload = () => {
    if (posts.length === 0) {
      toast.warning("Không có dữ liệu để tải.");
      return;
    }

    const content = posts
      .filter((post) => post.message && post.message.trim() !== "")
      .map((post, index) => `${index + 1}. ${post.message.trim()}`)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `facebook_page_posts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto bg-white row">
      <div className="card mx-auto mt-lg-2 col-lg-3">
        <div className="card-header bg-white fw-bold py-3">
          Công cụ lấy bài viết Facebook từ đường link Page
        </div>
        <div className="card-body pt-4">
          <h6 className="card-subtitle mb-2 text-muted">Nhập link Facebook Page:</h6>
          <div className="input-group mb-2 py-3">
            <input
              className="form-control"
              type="text"
              placeholder="https://facebook.com/facebook"
              value={pageLink}
              onChange={(e) => setPageLink(e.target.value)}
            />
          </div>
          <h6 className="card-subtitle mb-2 text-muted">Nhập số bài viết (min = 3):</h6>
          <div className="input-group mb-3 py-3">
            <input
              className="form-control"
              type="number"
              min={3}
              placeholder="Nhập số bài viết cần lấy"
              value={postNumber}
              onChange={(e) => setPostNumber(e.target.value)}
            />
          </div>
          <Button
            className="py-2 w-100"
            onClick={handleGetPosts}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Lấy bài viết"}
          </Button>
          <Button
            className="py-2 w-100 mt-2"
            variant="success"
            onClick={handleDownload}
            disabled={posts.length === 0 && loading}
          >
            Tải xuống (.txt)
          </Button>
        </div>
      </div>

      <div className="col-lg-9 bg-white py-3">
        <h6>Danh sách bài viết trong page:</h6>
        <div
          className="card mx-auto mt-lg-2 overflow-y-auto"
          style={{ maxHeight: "90vh" }}
        >
          <ul className="p-0 mx-4" style={{ listStyle: "none" }}>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <li key={index} className="mb-3 border-bottom pb-2">
                  <strong>{index + 1}.</strong>{" "}
                  {post.message?.substring(0, 200)} <br />
                </li>
              ))
            ) : (
              <p>Chưa có dữ liệu hoặc chưa nhập link.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GetPostPage;
