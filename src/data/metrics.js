export const METRICS_FILTERS = [
    {
      label: 'Daily',
      value: 'daily',
      isDefault: true
    },
    {
      label: 'Hourly',
      value: 'hourly'
    },
    {
      label: 'Last Hour',
      value: 'hourly_rolling'
    }
  ];

export const METRICS_DEFAULT_FILTERS = METRICS_FILTERS.find(({ isDefault }) => isDefault);

  