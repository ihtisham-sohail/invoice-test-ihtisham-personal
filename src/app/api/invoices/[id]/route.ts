import { NextResponse, NextRequest } from "next/server";
import invoiceData from "@/data/invoices.json";
import { Invoice, LineItem } from "@/utils/data-helpers";

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
  const sortByQuery = request.nextUrl.searchParams.get("sortBy");

  const data = invoiceData.invoices.filter(
    ({ recipient }) => recipient === context.params.id
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

  return NextResponse.json({ data });
}
