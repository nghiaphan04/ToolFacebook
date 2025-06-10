"use client";

import { Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Post {
  author: { id: string; name: string; url: string };
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

const GetPostGroup = () => {
  const [groupLink, setGroupLink] = useState("");
  const [postNumber, setPostNumber] = useState("3");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroupIdFromLink = async (link: string): Promise<string | null> => {
    try {
      const res = await axios.request({
        method: "GET",
        url: "https://facebook-scraper3.p.rapidapi.com/group/id",
        params: { url: link },
        headers: {
          "x-rapidapi-key": "11346e5537msh5921e328f482712p1715f3jsnd5108e6aa4b9",
          "x-rapidapi-host": "facebook-scraper3.p.rapidapi.com",
        },
      });
      console.log("Group ID:", res.data);
      return res.data?.group_id|| null;
    } catch (error) {
      toast.error("Không thể lấy Group ID từ link. Kiểm tra lại link."+error);
      return null;
    }
  };

  const fetchGroupPostsWithCursor = async (
    groupId: string,
    cursor: string | null = null
  ): Promise<{ posts: Post[]; cursor: string | null }> => {
    try {
      const res = await axios.request({
        method: "GET",
        url: "https://facebook-scraper3.p.rapidapi.com/group/posts",
        params: {
          group_id: groupId,
          sorting_order: "CHRONOLOGICAL",
          ...(cursor ? { cursor } : {}),
        },
        headers: {
          "x-rapidapi-key": "11346e5537msh5921e328f482712p1715f3jsnd5108e6aa4b9",
          "x-rapidapi-host": "facebook-scraper3.p.rapidapi.com",
        },
      });
      return {
        posts: res.data.posts || [],
        cursor: res.data.cursor || null,
      };
    } catch (error) {
      toast.error("Lỗi khi lấy bài viết."+error);
      return { posts: [], cursor: null };
    }
  };

  const handleGetPosts = async () => {
    if (!groupLink.trim()) {
      toast.warning("Vui lòng nhập link group.");
      return;
    }

    setLoading(true);
    const groupId = await fetchGroupIdFromLink(groupLink.trim());

    if (!groupId) {
      setLoading(false);
      return;
    }

    let allPosts: Post[] = [];
    let cursor: string | null = null;
    const targetCount = Number(postNumber);

    while (allPosts.length < targetCount) {
      const { posts: fetched, cursor: nextCursor } = await fetchGroupPostsWithCursor(groupId, cursor);
      if (fetched.length === 0) break;
      allPosts = [...allPosts, ...fetched];
      cursor = nextCursor;
      if (!cursor) break;
    }

    setPosts(allPosts.slice(0, targetCount));
    setLoading(false);
    setPostNumber("3");
    setGroupLink("");
  };

  const handleDownload = () => {
    if (posts.length === 0) {
      toast.warning("Không có dữ liệu để tải.");
      return;
    }
    const content = posts
      .filter((p) => p.message?.trim())
      .map((p, i) => `${i + 1}. ${p.message.trim()}`)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `group_posts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto bg-white row">
      <div className="card mx-auto mt-lg-2 col-lg-3">
        <div className="card-header bg-white fw-bold py-3">
          Công cụ lấy bài viết Facebook từ link Group
        </div>
        <div className="card-body pt-4">
          <h6 className="card-subtitle mb-2 text-muted">Nhập link Group:</h6>
          <div className="input-group mb-2 py-3">
            <input
              className="form-control"
              type="text"
              placeholder="https://facebook.com/groups/..."
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
            />
          </div>
          <h6 className="card-subtitle mb-2 text-muted">Số bài viết (min = 3):</h6>
          <div className="input-group mb-3 py-3">
            <input
              className="form-control"
              type="text"
              placeholder="Số bài viết cần lấy"
              value={postNumber}
              onChange={(e) => setPostNumber(e.target.value)}
            />
          </div>
          <Button className="py-2 w-100" onClick={handleGetPosts} disabled={loading}>
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
        <h6>Danh sách bài viết:</h6>
        <div className="card mx-auto mt-lg-2 overflow-y-auto" style={{ maxHeight: "90vh" }}>
          <ul className="p-0 mx-4" style={{ listStyle: "none" }}>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <li key={index} className="mb-3 border-bottom pb-2">
                  <strong>{index + 1}.</strong> {post.message?.substring(0, 200)} <br />
                </li>
              ))
            ) : (
              <p>Chưa có dữ liệu hoặc chưa nhập link group.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GetPostGroup;
