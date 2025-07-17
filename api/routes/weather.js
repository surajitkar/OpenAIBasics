// Weather API endpoints
import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * @swagger
 * /api/weather/current:
 *   get:
 *     summary: Get current weather
 *     description: Get current weather information for a specified city
 *     tags: [Weather]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name to get weather for
 *         example: "Tokyo"
 *     responses:
 *       200:
 *         description: Current weather information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     country:
 *                       type: string
 *                     region:
 *                       type: string
 *                     lat:
 *                       type: number
 *                     lon:
 *                       type: number
 *                 current:
 *                   type: object
 *                   properties:
 *                     temperature:
 *                       type: string
 *                     description:
 *                       type: string
 *                     humidity:
 *                       type: string
 *                     wind_speed:
 *                       type: string
 *                     feels_like:
 *                       type: string
 *                 data_source:
 *                   type: string
 *                   enum: [real, mock]
 */
router.get('/current', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'City parameter is required',
        code: 'MISSING_CITY'
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      // Return mock data when API key is not configured
      res.json({
        location: {
          name: city,
          country: 'Unknown',
          region: 'Unknown',
          lat: 0,
          lon: 0
        },
        current: {
          temperature: '22°C',
          description: 'Clear sky',
          humidity: '45%',
          wind_speed: '10 km/h',
          feels_like: '24°C'
        },
        data_source: 'mock',
        note: 'Using mock data. Set WEATHER_API_KEY environment variable for real weather data.'
      });
      return;
    }

    try {
      const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
      const response = await axios.get(url);
      const weather = response.data;
      
      res.json({
        location: {
          name: weather.location.name,
          country: weather.location.country,
          region: weather.location.region,
          lat: weather.location.lat,
          lon: weather.location.lon
        },
        current: {
          temperature: `${weather.current.temp_c}°C`,
          description: weather.current.condition.text,
          humidity: `${weather.current.humidity}%`,
          wind_speed: `${weather.current.wind_kph} km/h`,
          feels_like: `${weather.current.feelslike_c}°C`
        },
        data_source: 'real'
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        res.status(404).json({
          error: 'City Not Found',
          message: `Weather data not found for city: ${city}`,
          code: 'CITY_NOT_FOUND'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'WEATHER_API_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/weather/forecast:
 *   get:
 *     summary: Get weather forecast
 *     description: Get weather forecast for a specified city
 *     tags: [Weather]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name to get forecast for
 *         example: "London"
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           default: 3
 *         description: Number of days to forecast
 *     responses:
 *       200:
 *         description: Weather forecast information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: object
 *                 current:
 *                   type: object
 *                 forecast:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       max_temp:
 *                         type: string
 *                       min_temp:
 *                         type: string
 *                       description:
 *                         type: string
 *                       humidity:
 *                         type: string
 *                       wind_speed:
 *                         type: string
 *                 data_source:
 *                   type: string
 */
router.get('/forecast', async (req, res) => {
  try {
    const { city, days = 3 } = req.query;

    if (!city) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'City parameter is required',
        code: 'MISSING_CITY'
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      // Return mock forecast data
      const mockForecast = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        mockForecast.push({
          date: date.toISOString().split('T')[0],
          max_temp: `${20 + Math.floor(Math.random() * 15)}°C`,
          min_temp: `${10 + Math.floor(Math.random() * 10)}°C`,
          description: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.random() * 4)],
          humidity: `${40 + Math.floor(Math.random() * 30)}%`,
          wind_speed: `${5 + Math.floor(Math.random() * 15)} km/h`
        });
      }

      res.json({
        location: {
          name: city,
          country: 'Unknown',
          region: 'Unknown'
        },
        current: {
          temperature: '22°C',
          description: 'Clear sky',
          humidity: '45%',
          wind_speed: '10 km/h'
        },
        forecast: mockForecast,
        data_source: 'mock',
        note: 'Using mock data. Set WEATHER_API_KEY environment variable for real weather data.'
      });
      return;
    }

    try {
      const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=${days}`;
      const response = await axios.get(url);
      const weather = response.data;
      
      const forecast = weather.forecast.forecastday.map(day => ({
        date: day.date,
        max_temp: `${day.day.maxtemp_c}°C`,
        min_temp: `${day.day.mintemp_c}°C`,
        description: day.day.condition.text,
        humidity: `${day.day.avghumidity}%`,
        wind_speed: `${day.day.maxwind_kph} km/h`
      }));

      res.json({
        location: {
          name: weather.location.name,
          country: weather.location.country,
          region: weather.location.region
        },
        current: {
          temperature: `${weather.current.temp_c}°C`,
          description: weather.current.condition.text,
          humidity: `${weather.current.humidity}%`,
          wind_speed: `${weather.current.wind_kph} km/h`
        },
        forecast,
        data_source: 'real'
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        res.status(404).json({
          error: 'City Not Found',
          message: `Weather data not found for city: ${city}`,
          code: 'CITY_NOT_FOUND'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Weather forecast error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'WEATHER_FORECAST_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/weather/search:
 *   get:
 *     summary: Search for cities
 *     description: Search for cities that match the query
 *     tags: [Weather]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for city name
 *         example: "New York"
 *     responses:
 *       200:
 *         description: List of matching cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       country:
 *                         type: string
 *                       region:
 *                         type: string
 *                       lat:
 *                         type: number
 *                       lon:
 *                         type: number
 *                 data_source:
 *                   type: string
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search query (q) parameter is required',
        code: 'MISSING_QUERY'
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      // Return mock search results
      const mockResults = [
        {
          name: q,
          country: 'Unknown',
          region: 'Unknown',
          lat: 0,
          lon: 0
        }
      ];

      res.json({
        results: mockResults,
        data_source: 'mock',
        note: 'Using mock data. Set WEATHER_API_KEY environment variable for real city search.'
      });
      return;
    }

    try {
      const url = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(q)}`;
      const response = await axios.get(url);
      const results = response.data;
      
      const cities = results.map(city => ({
        name: city.name,
        country: city.country,
        region: city.region,
        lat: city.lat,
        lon: city.lon
      }));

      res.json({
        results: cities,
        data_source: 'real'
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        res.status(404).json({
          error: 'No Results Found',
          message: `No cities found matching: ${q}`,
          code: 'NO_RESULTS_FOUND'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Weather search error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'WEATHER_SEARCH_ERROR'
    });
  }
});

export default router;