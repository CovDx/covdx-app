import { ScanResult } from './scan-result';

export class ScanListItem {
  id: string;
  timestamp: string;
  tag: string;
  status: string;
  result: ScanResult;
}
