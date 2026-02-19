import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";

export async function ProductsTable({ products }: { products: any[] }) {
  return <DataTable searchKey="name" columns={columns} data={products} />;
}
