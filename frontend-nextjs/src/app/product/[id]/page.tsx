import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { getStorefrontProduct } from "@/utils/storefront";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const product = await getStorefrontProduct(id);
    
    if (!product) {
      return notFound();
    }

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />

        <main className="flex-1 py-8 md:py-10">
          <Container>
            <ProductDetailClient product={product} />
          </Container>
        </main>

        <Footer />
      </div>
    );
  } catch {
    notFound();
  }
}
