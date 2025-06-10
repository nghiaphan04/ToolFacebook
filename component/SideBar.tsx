
import React from 'react';
import Link from 'next/link';
interface MenuItem {
    name: string;
    path: string;
}

const Sidebar: React.FC = () => {

    const menuItems: MenuItem[] = [
        { name: 'Find id by link', path: '/FindId'},
        { name: 'Get cmt by post', path: '/GetComment'},
        { name: 'Lấy post group', path: '/GetPostGroup'},
        { name: 'Lấy post page', path: '/GetPostPage' },
        { name: 'Chưa biết', path: '/#' },
    ];

    return  (
        <div className="d-flex flex-column border-end min-vh-100 p-3 bg-light col-lg-2">
            {menuItems.map((item) => (
                <Link key={item.name} href={item.path} className="d-flex align-items-center p-3 text-decoration-none text-dark rounded bg-light border-bottom">
                    {item.name}
                </Link>
            ))}
        </div>
    ) 
}

export default Sidebar;