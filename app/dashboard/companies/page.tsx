import { fetchFilteredCompanies } from '@/app/lib/data';
import CompaniesTable from '@/app/ui/companies/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Companies',
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

  const companies = await fetchFilteredCompanies();

  return (
    <main>
      <CompaniesTable companies={companies} />
    </main>
  );
}