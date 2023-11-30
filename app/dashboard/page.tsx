import { fetchFilteredEmployees } from '@/app/lib/data';
import EmployeesTable from '@/app/ui/employees/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employees',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';

  const employees = await fetchFilteredEmployees(query);

  return (
    <main>
      <EmployeesTable employees={employees} />
    </main>
  );
}