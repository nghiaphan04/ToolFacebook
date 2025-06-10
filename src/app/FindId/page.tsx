"use client";

import { useState } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const FindId: React.FC = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  const extractUsername = (url: string): string | null => {
    try {
      const cleanUrl = url.trim().replace(/\/+$/, "");
      const match = cleanUrl.match(/facebook\.com\/([^/?#]+)/i);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const handleGetUid = async () => {
    const username = extractUsername(link);

    if (!username) {
      toast.warning("Link không hợp lệ hoặc không tìm thấy username.");
      return;
    }

    setLoading(true);
    setUid(null);

    try {
      const response = await axios.post(
        "https://facebook-media-api.p.rapidapi.com/user/id",
        { username },
        {
          headers: {
               "x-rapidapi-key": "11346e5537msh5921e328f482712p1715f3jsnd5108e6aa4b9",
          "x-rapidapi-host": "facebook-scraper3.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      setUid(response.data?.user_id || "Không tìm thấy UID.");
    } catch (error) {
      toast.error("Lỗi khi lấy UID."+error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-lg-8 mx-auto bg-white">
      <div className="card mx-auto mt-lg-5">
        <div className="card-header bg-white fw-bold py-3">
          Công cụ miễn phí giúp bạn dễ dàng lấy UID Facebook một cách dễ dàng.
        </div>
        <div className="card-body pt-4">
          <h6 className="card-subtitle mb-2 text-muted">Link Facebook</h6>
          <div className="input-group mb-3 py-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập link facebook cần lấy ID"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <Button className="py-2 w-100" onClick={handleGetUid} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Lấy ID"}
          </Button>

          {uid && (
            <div className="mt-3 alert alert-info text-center">
              <strong>UID:</strong> {uid}
            </div>
          )}
        </div>
        <div className="card-footer bg-white py-3"></div>
      </div>
    </div>
  );
};

export default FindId;
