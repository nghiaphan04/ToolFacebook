'use client'

import { Button } from "react-bootstrap";

const FindId: React.FC = () => {
    return (
        <div className="col-lg-8 mx-auto bg-white">
            <div className="card mx-auto mt-lg-5">
                <div className="card-header bg-white fw-bold py-3">
                        Công cụ miễn phí giúp bạn dễ dàng lấy UID Facebook một cách dễ dàng.
                </div>
                <div className="card-body pt-4">
                    <h6 className="card-subtitle mb-2 text-muted">Link Facebook</h6>
                    <div className="input-group mb-3 py-3">
                        <input type="text" className="form-control" placeholder="Nhập link facebook cần lấy id" aria-label="Username" aria-describedby="basic-addon1"/>
                    </div>
                    <Button className="py-2" style={{width: '100%'}}>Lấy ID</Button>
                    
                </div>
                <div className="card-footer bg-white py-3">
                        
                </div>
            </div>
        </div>
    );
};

export default FindId;
