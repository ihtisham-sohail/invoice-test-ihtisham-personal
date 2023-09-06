import { NextResponse, NextRequest } from "next/server";
import invoiceData from "@/data/invoices.json";
import { LineItem } from "@/utils/data-helpers";

interface ParamType {
  id: string;
}

interface ContextType {
  params: ParamType;
}

function invoiceAsc(a: any, b: any) {
  return a.number - b.number;
}

function invoiceDsc(a: any, b: any) {
  return b.number - a.number;
}

export async function GET(request: NextRequest, context: ContextType) {
  try {
    const sortByQuery = request.nextUrl.searchParams.get("sortBy");

    const userId = context.params.id;

    // add any kind of validation for the UUID
    if (userId.length !== 36) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "The ID provided is not a valid uuid",
      });
    }

    let data = invoiceData.invoices.filter(
      ({ recipient }) => recipient === userId
    );
    // checking for discount
    data.map((inv: any) => {
      if (!inv.settled) {
        const total = inv.items.reduce(
          (a: number, b: LineItem) => a + b.price * b.quantity,
          0
        );
        if (total / 100 > 100) {
          inv.discount = (10 / 100) * total;
        }
      }
    });

    // apply sort if given in query params
    if (sortByQuery && sortByQuery === "asc") {
      data.sort(invoiceAsc);
    } else if (sortByQuery && sortByQuery === "dsc") {
      data.sort(invoiceDsc);
    }

    if (data?.length) {
      return NextResponse.json({ data }, { status: 200 });
    } else {
      return new Response(null, { status: 204, statusText: "No Data Found" });
    }
  } catch (err) {
    return NextResponse.json(
      { error: `Failed because of ${err}` },
      { status: 500 }
    );
  }
}
