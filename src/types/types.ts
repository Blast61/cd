export interface CsvRow {
  firstName: string;
  lastName: string;
  eventDate: string;
  expanded?: boolean;
  hasDuplicates?: boolean;
}

export interface CsvDataWithDuplicates extends CsvRow{
  expanded: boolean;
  hasDuplicates: boolean;
}