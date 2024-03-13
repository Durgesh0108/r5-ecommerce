import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string, categoryId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    // const categoryId = searchParams.get('categoryId') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const color = searchParams.get('color') || undefined;
    const size = searchParams.get('size') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    console.log("categoryId",categoryId)
    console.log("Size",size)
    console.log("Color",color)

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        // category: {
        //   name: {
        //     equals: category
        //   }
        // },
        // categoryId,
        color: {
          name: {
            contains: color
          }
        },
        size: {
          name: {
            contains: size
          }
        },
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// export async function GET(
//   req: Request,
//   { params }: { params: { storeId: string } },
// ) {

//   const { searchParams } = new URL(req.url)
//   const categoryId = searchParams.get('categoryId') || undefined;
//   const color = searchParams.get('color') || undefined;
//   const size = searchParams.get('size') || undefined;
//   const isFeatured = searchParams.get('isFeatured');

//   if (!params.storeId) {
//     return new NextResponse("Store id is required", { status: 400 });
//   }

//   let filterProducts: {}[] = []

//   const categoryProducts = await prismadb.product.findMany({
//     where: {
//       storeId: params.storeId,
//       categoryId,
//       // isFeatured: isFeatured ? true : undefined,
//       // isArchived: false,
//     },
//     include: {
//       images: true,
//       // category: true,
//       // color: true,
//       // size: true,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     }
//   });
//   console.log("category", categoryProducts)

//   const sizeProducts = await prismadb.product.findMany({
//     where: {
//       storeId: params.storeId,
//       categoryId,
//       size: {
//         name: size
//       },
//       // isFeatured: isFeatured ? true : undefined,
//       // isArchived: false,
//     },
//     include: {
//       images: true,
//       // category: true,
//       // color: true,
//       // size: true,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     }
//   });
//   console.log("size", sizeProducts)
//   const colorProducts = await prismadb.product.findMany({
//     where: {
//       storeId: params.storeId,
//       categoryId,
//       color: {
//         name: color
//       },
//       // isFeatured: isFeatured ? true : undefined,
//       // isArchived: false,
//     },
//     include: {
//       images: true,
//       // category: true,
//       // color: true,
//       // size: true,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     }
//   });
//   console.log("color", colorProducts)

//   filterProducts = [{ category: { ...categoryProducts }, color: { ...colorProducts }, size: { ...sizeProducts } }]

//   function filterDuplicateProducts(products: {}[]) {
//     const uniqueProducts = [];
//     const encounteredIds = new Set();

//     for (const product of products) {
//       // @ts-ignore
//       if (!encounteredIds.has(product.id)) {
//         uniqueProducts.push(product);
//         // @ts-ignore
//         encounteredIds.add(product.id);
//       }
//     }

//     return uniqueProducts;
//   }
//   try {
//     // console.log("filter", filterProducts)
//     // const products = await filterDuplicateProducts(filterProducts)
//     return NextResponse.json(filterProducts);
//   } catch (error) {
//     console.log('[PRODUCTS_GET]', error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// };