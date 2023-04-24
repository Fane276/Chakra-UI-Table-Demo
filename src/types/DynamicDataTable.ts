import { TableProps } from "@chakra-ui/react";

export interface DynamicDataTableOptions extends TableProps { 
  pagination?: boolean;
  pageSize?: number;
  colDefs: Array<ColDef>;
  request: (tableProps: DynamicDataTableProps, callback: (data:DynamicDataTableResult)=>Promise<any>) => Promise<any>;
  t?: (key: string) => string;
}
export interface DynamicDataTableProps {
  skipCount?: number;
  pageSize?: number;
}
export interface DynamicDataTableResult {
  items: Array<any>;
  totalCount: number;
}

export interface ColDef {
  title: string;
  width?: string;
  render: (item: any) => JSX.Element;
}

export interface PageNavigationProps{
  currentPage: number;
  lastPage: number;
  handlePageClick: any;
}