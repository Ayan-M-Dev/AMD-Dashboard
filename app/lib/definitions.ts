
// Manually generating, Not using any ORM
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Employees = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Companies = {
  id: string;
  name: string;
  employee_id: string;
  image_url: string;
}

export type Invoice = {
  id: string;
  employee_id: string;
  amount: number;
  date: string;
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type EmployeesTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedEmployeesTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CompaniesTable = {
  id: string;
  name: string;
  image_url: string;
  employee_id: string;
  employee_name: string;
}

export type FormattedCompaniesTable = {
  id: string;
  name: string;
  image_url: string;
};

export type EmployeeField = {
  id: string;
  name: string;
};

export type CompanyField = {
  id: string;
  name: string;
  image_url: string;
}

export type InvoiceForm = {
  id: string;
  employee_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
