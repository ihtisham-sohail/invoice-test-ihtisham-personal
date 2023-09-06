import { createMocks } from "node-mocks-http";
import { GET } from "./route";

describe("Find Invoices Route", () => {
  describe("GET invoices", () => {
    const customerId = "5ac51f7e-81b1-49c6-9c39-78b2d171abd6";
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const { req } = createMocks({
      method: "GET",
    });

    it("should return a list of inovices by id", async () => {
      console.log(req);
      const invoiceRequest = await GET(req, {
        params: { id: customerId },
      });
      const invoices = await invoiceRequest.json();
      expect(invoiceRequest.status).toEqual(200);
      expect(invoices.data.length).toBeGreaterThan(0);
    });

    it("should give appropiate status if issue is in ID syntax", async () => {
      const invoiceRequest = await GET(req, {
        params: { id: "not-a-valid-id" },
      });
      const customer = await invoiceRequest.json();
      expect(invoiceRequest.status).toEqual(400);
      expect(customer).toEqual(null);
    });

    it("should give appropiate status if no invoices found", async () => {
      const invoiceRequest = await GET(req, {
        params: { id: fakeId },
      });
      expect(invoiceRequest.status).toEqual(204);
    });

    it("should give sorted result by query params", async () => {
      const invoiceRequest = await GET(req, {
        params: { id: customerId },
      });
      const inovices = await invoiceRequest.json();
      expect(invoiceRequest.status).toEqual(200);
      expect(inovices.data).toStrictEqual(
        [...inovices.data].sort(sortingFunctionAsc)
      );
    });
  });
});

function sortingFunctionAsc(a: any, b: any) {
  return a.number - b.number;
}
