export interface ClicksPerDay {
  date: string;
  count: number;
}

export interface MetricCount {
  label: string;
  count: number;
}

export interface UrlAnalytics {
  shortCode: string;
  totalClicks: number;
  clicksPerDay: ClicksPerDay[];
  devices: MetricCount[];
  browsers: MetricCount[];
  countries: MetricCount[];
}
