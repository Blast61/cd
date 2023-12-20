export interface CsvRow {
  firstName: string;
  lastName: string;
  eventDate: string;
  expanded?: boolean;
  hasDuplicates?: boolean;
}
