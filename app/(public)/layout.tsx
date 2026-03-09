import Footer from "@/components/layout/footer/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-grow dark:bg-black">
        {children}
      </main>
      <Footer />
    </>
  );
}
