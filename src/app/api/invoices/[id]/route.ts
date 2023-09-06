import { NextResponse, NextRequest } from "next/server";
import invoiceData from "@/data/invoices.json";

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

  if (sortByQuery && sortByQuery === "asc") {
    data.sort(invoiceAsc);
  } else if (sortByQuery && sortByQuery === "dsc") {
    data.sort(invoiceDsc);
  }
  return NextResponse.json({ data });
}
