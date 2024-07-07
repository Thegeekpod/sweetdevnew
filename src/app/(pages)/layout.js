import { Inter } from "next/font/google";
import "./index.scss";
import Header from "@/component/main/partical/header/Header"
import Footer from "@/component/main/partical/footer/Footer";
import VoiceControl from "@/component/main/common/VoiceControl";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    
      <body className={inter.className}>
        <VoiceControl/>
      <Header style_home_one={true} />
        
        {children}
        <Footer/>
        </body>
      
    </html>
  );
}
