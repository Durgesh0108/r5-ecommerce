import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

// export async function GET(
//   req: Request,
//   { params }: { params: { storeId: string } },
// ) {
//   const { searchParams } = new URL(req.url)
//   const query = searchParams.get('q') || undefined
//   const categoryId = searchParams.get('categoryId') || undefined;
//   const color = searchParams.get('color') || undefined;
//   const size = searchParams.get('size') || undefined;

//   if (!params.storeId) {
//     return new NextResponse("Store id is required", { status: 400 });
//   }

//   let queryProducts: {}[] = []

//   const categoryProducts = await prismadb.product.findMany({
//     where: {
//       storeId: params.storeId,
//       categoryId,
//       category: {
//         name: {
//           contains: query
//         }
//       },

//     },
//     include: {
//       images: true,
//       category: true,
//       color: true,
//       size: true,
//     },
//   })

//   const sizeProducts = await prismadb.product.findMany({
//     where: {
//       storeId: params.storeId,
//       size: {
//         name: {
//           contains: query || size
//         }
//       },
//       // color: {
//       //   name: {
//       //     contains: query
//       //   }
//       // }
//     },
//     include: {
//       images: true,
//       category: true,
//       color: true,
//       size: true,
//     },
//   })

//   const colorProducts = await prismadb.product.findMany({
//     where: {
//       storeId: params.storeId,
//       color: {
//         name: {
//           contains: query || color
//         }
//       }
//     },
//     include: {
//       images: true,
//       category: true,
//       color: true,
//       size: true,
//     },
//   })

//   const productNameProducts = await prismadb.product.findMany({
//     where: {
//       storeId: params.storeId,
//       name: {
//         contains: query
//       }
//     },
//     include: {
//       images: true,
//       category: true,
//       color: true,
//       size: true,
//     },
//   })

//   queryProducts = [...productNameProducts, ...categoryProducts, ...colorProducts, ...sizeProducts]

//   const productByFilter = await prismadb.product.findMany({
//     where: {
//       storeId: params.storeId,
//       categoryId,
//       // category: {
//       //   name: {
//       //     equals: category
//       //   }
//       // },
//       // categoryId,
//       color: {
//         name: {
//           contains: color
//         }
//       },
//       size: {
//         name: {
//           contains: size
//         }
//       },
//       // isFeatured: isFeatured ? true : undefined,
//       // isArchived: false,
//     },
//     include: {
//       images: true,
//       category: true,
//       color: true,
//       size: true,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     }
//   });

//   const newProductList = [...productByFilter, ...queryProducts]

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
//     const products = await filterDuplicateProducts(newProductList)

//     return NextResponse.json({
//       items: products.length,
//       products
//     });
//   } catch (error) {
//     console.log('[PRODUCTS_GET]', error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// };


export async function GET(req: Request,
  { params }: { params: { storeId: string } }) {
  const { searchParams } = new URL(req.url)
  const min = searchParams.get('min') || undefined
  const max = searchParams.get('max') || undefined
  const query = searchParams.get('q') || undefined
  const categoryId = searchParams.get('categoryId') || undefined;
  const color = searchParams.get('color') || undefined;
  const size = searchParams.get('size') || undefined;
  const highToLow = searchParams.get('highToLow') || "desc";

  if (!params.storeId) {
    return new NextResponse("Store id is required", { status: 400 });
  }

  let queryProducts: {}[] = []

  const productByFilter = await prismadb.product.findMany({
    where: {
      
      AND: [
        // {
        //   price: {
        //     gt: min
        //   }
        // },
        // {
        //   price: {
        //     lt: max
        //   }
        // },
        {
          name: {
            search: query,
            
          }
        },
        {
          size: {
            name: {
              // @ts-ignore
              search: size
            }
          }
        },
        {
          color: {
            name: {
              search: color
            },

          },

        }
      ],
      
      // color: {
      //   name: {
      //     // @ts-ignore
      //     // in: color,

      //     search: color
      //   },

      // }

      // AND: [

      // ]


      // categoryId,
      // category: {
      //   name: {
      //     equals: category
      //   }
      // },
      // categoryId,
      // color: {
      //   name: {
      //     contains: color
      //   }
      // },
      // size: {
      //   name: {
      //     contains: size
      //   }
      // },
      // isFeatured: isFeatured ? true : undefined,
      // isArchived: false,
    },

    include: {
      
      images: true,
      category: {
        select: {
          name: true
        }
      },
      color: {
        select: {
          name: true
        }
      },
      size: {
        select: {
          name: true
        }
      },
    },
    // @ts-ignore
    orderBy: {
      price: highToLow,
    }
    // orderBy: {
    //   price: "desc",
    // }

  });

  try {
    // const products = await filterDuplicateProducts(newProductList)

    return NextResponse.json({
      items: productByFilter.length,
      products: productByFilter
    });
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}



// Average


// export async function GET(req: Request,
//   { params }: { params: { storeId: string } }) {
//   const { searchParams } = new URL(req.url)
//   const min = searchParams.get('min') || undefined
//   const max = searchParams.get('max') || undefined
//   const query = searchParams.get('q') || undefined
//   const categoryId = searchParams.get('categoryId') || undefined;
//   const color = searchParams.get('color') || undefined;
//   const size = searchParams.get('size') || undefined;
//   const highToLow = searchParams.get('highToLow') || "desc";

//   if (!params.storeId) {
//     return new NextResponse("Store id is required", { status: 400 });
//   }

//   let queryProducts: {}[] = []

//   const productByFilter = await prismadb.product.aggregate({
//     _avg: {
//       price: true
//     },

//     where: {
//       AND: [
//         // {
//         //   price: {
//         //     gt: min
//         //   }
//         // },
//         // {
//         //   price: {
//         //     lt: max
//         //   }
//         // },
//         {
//           name: {
//             contains: query
//           }
//         },
//         {
//           size: {
//             name: {
//               // @ts-ignore
//               contains: size
//             }
//           }
//         },
//         {
//           color: {
//             name: {
//               contains: color
//             },

//           },

//         }
//       ],

//       // AND: [

//       // ]


//       // categoryId,
//       // category: {
//       //   name: {
//       //     equals: category
//       //   }
//       // },
//       // categoryId,
//       // color: {
//       //   name: {
//       //     contains: color
//       //   }
//       // },
//       // size: {
//       //   name: {
//       //     contains: size
//       //   }
//       // },
//       // isFeatured: isFeatured ? true : undefined,
//       // isArchived: false,
//     },

//     // include: {
//     //   images: true,
//     //   category: {
//     //     select: {
//     //       name: true
//     //     }
//     //   },
//     //   color: {
//     //     select: {
//     //       name: true
//     //     }
//     //   },
//     //   size: {
//     //     select: {
//     //       name: true
//     //     }
//     //   },
//     // },
//     // // @ts-ignore
//     // orderBy: {
//     //   price: highToLow,
//     // }
//     // orderBy: {
//     //   price: "desc",
//     // }

//   });

//   try {
//     // const products = await filterDuplicateProducts(newProductList)

//     return NextResponse.json({
//       // items: productByFilter.length,
//       products: productByFilter
//     });
//   } catch (error) {
//     console.log('[PRODUCTS_GET]', error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }




