import { sql } from '@vercel/postgres';
import {
 EmployeeField,
 EmployeesTable,
 CompanyField,
 InvoiceForm,
 InvoicesTable,
 User,
 CompaniesTable,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';


const ITEMS_PER_PAGE = 6;

// fetch invoices based on a search query and current page
export async function fetchFilteredInvoices(
 query: string,
 currentPage: number,
) {
 const offset = (currentPage - 1) * ITEMS_PER_PAGE;

 try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        employees.name,
        employees.email,
        employees.image_url
      FROM invoices
      JOIN employees ON invoices.employee_id = employees.id
      WHERE
        employees.name ILIKE ${`%${query}%`} OR
        employees.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
 } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
 }
}

// fetch the total number of pages based on a search query
export async function fetchInvoicesPages(query: string) {
 noStore()

 try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN employees ON invoices.employee_id = employees.id
    WHERE
      employees.name ILIKE ${`%${query}%`} OR
      employees.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
 `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
 } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
 }
}

// fetch an invoice by its ID
export async function fetchInvoiceById(id: string) {
 noStore()
  
 try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.employee_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
 } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
 }
}

// fetch all employees
export async function fetchEmployees() {
 try {
    const data = await sql<EmployeeField>`
      SELECT
        id,
        name
      FROM employees
      ORDER BY name ASC
    `;

    const employees = data.rows;
    return employees;
 } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all employees.');
 }
}

// fetch employees based on a search query
export async function fetchFilteredEmployees(query: string) {
 try {
    const data = await sql<EmployeesTable>`
		SELECT
		 employees.id,
		 employees.name,
		 employees.email,
		 employees.image_url,
		 COUNT(invoices.id) AS total_invoices,
		 SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		 SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM employees
		LEFT JOIN invoices ON employees.id = invoices.employee_id
		WHERE
		 employees.name ILIKE ${`%${query}%`} OR
        employees.email ILIKE ${`%${query}%`}
		GROUP BY employees.id, employees.name, employees.email, employees.image_url
		ORDER BY employees.name ASC
	 `;

    const employees = data.rows.map((employee) => ({
      ...employee,
      total_pending: formatCurrency(employee.total_pending),
      total_paid: formatCurrency(employee.total_paid),
    }));

    return employees;
 } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch employee table.');
 }
}

// fetch all companies
export async function fetchCompanies() {
 try {
    const data = await sql<CompanyField>`
      SELECT
      id,
      name,
      FROM company
      ORDER BY name ASC
      `;

      const companies = data.rows;
      return companies;
 } catch (err) {
    console.error('Database Error', err);
    throw new Error('Failed to fetch all companies.')
 }
}

// fetch companies based on a search query
export async function fetchFilteredCompanies() {
 try {
    const data = await sql<CompaniesTable>`
		SELECT
      companies.id,
      companies.name,
      companies.image_url
		FROM companies
		GROUP BY companies.id, companies.name, companies.image_url
		ORDER BY companies.name ASC
	 `;

    const companies = data.rows.map((company) => ({
      ...company
    }));

    return companies;
 } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch employee table.');
 }
}

// fetch a user by their email address
export async function getUser(email: string) {
 try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
 } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
 }
}