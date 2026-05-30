import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import UserContextProvider from "./(Context)/Context";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserContextProvider>
        <Navbar />
        <main>{children}</main>
        <Footer/>
      </UserContextProvider>
    </>
  );
}

