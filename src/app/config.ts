export const appConfig = {
  defaultUnit: 'metric',
  defaultCity: {
    coord: {
      latitude: 51.509865,
      longitude: -0.118092
    }
  }
};

interface MeasurementUnits {
  temperature: string;
  windSpeed: string;
  pressure: string;
}

interface MeasurementUnitConfig {
  metric: MeasurementUnits;
  imperial: MeasurementUnits;
  [key: string]: MeasurementUnits | undefined;
}

export const apiConfig = {
  host: 'https://api.openweathermap.org/data/2.5',
  appId: '0f3fb9fa31ad3d41f1bb2bd0841c3f2f',
  measurementUnits:  {
    metric: {
      temperature: 'C',
      windSpeed: 'm/s',
      pressure: 'mmHg'
    },
    imperial: {
      temperature: 'F',
      windSpeed: 'mil/h',
      pressure: 'hPa'
    },
  },
  amountForecastDays: 16,
  updateInterval: {
    forecast: 300000, // 5 minutes
    weather: 300000 // 5 minutes
  }
};