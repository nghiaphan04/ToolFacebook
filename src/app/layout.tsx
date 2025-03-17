import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from '../../component/SideBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    
      <body style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'hidden' }} className="container-fluid row mx-0 px-0 bg-white">
      <ToastContainer/>
        <SideBar/>
       
        <div className="col-lg-10 text-black">
          {children}
         </div>
       
      </body>
    </html>
  );
}
