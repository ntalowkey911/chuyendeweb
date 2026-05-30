import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let productId = "";

  try {
    const body = (await request.json()) as { productId?: string };
    productId = body.productId ?? "";
  } catch {
    productId = "";
  }

  revalidatePath("/");
  revalidatePath("/menu");

  if (productId) {
    revalidatePath(`/product/${productId}`);
    revalidatePath(`/products/${productId}`);
  }

  return NextResponse.json({ revalidated: true, productId });
}
