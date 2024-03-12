import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || undefined
  const categoryId = searchParams.get('categoryId') || undefined;
  const colorId = searchParams.get('colorId') || undefined;
  const sizeId = searchParams.get('sizeId') || undefined;
  const isFeatured = searchParams.get('isFeatured');

  if (!params.storeId) {
    return new NextResponse("Store id is required", { status: 400 });
  }

  let queryProducts: {}[] = []

  const categoryProducts = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
      category: {
        name: {
          contains: query
        }
      },
    },
  })

  const sizeProducts = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
      size: {
        name: {
          contains: query
        }
      },
      color: {
        name: {
          contains: query
        }
      }
    },
  })

  const colorProducts = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
      color: {
        name: {
          contains: query
        }
      }
    },
  })

  const productNameProducts = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
      name: {
        contains: query
      }
    },
  })

  queryProducts = [...productNameProducts, ...categoryProducts, ...colorProducts, ...sizeProducts]

  function filterDuplicateProducts(products: {}[]) {
    const uniqueProducts = [];
    const encounteredIds = new Set();

    for (const product of products) {
      // @ts-ignore
      if (!encounteredIds.has(product.id)) {
        uniqueProducts.push(product);
        // @ts-ignore
        encounteredIds.add(product.id);
      }
    }

    return uniqueProducts;
  }

  try {
    const products = await filterDuplicateProducts(queryProducts)

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};