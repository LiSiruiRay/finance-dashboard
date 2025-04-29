"use server";

const API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY || "";
const BASE_URL = "https://www.alphavantage.co/query";

export type StockData = {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type StockDataResponse = {
  data: StockData[];
  latestPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  error?: string;
};

type TimeFrame = "1hour" | "1day" | "1week" | "1month" | "1year" | "max";

export async function fetchStockData(
  symbol: string,
  timeFrame: TimeFrame = "1day"
): Promise<StockDataResponse> {
  try {
    let url: string;

    // Build URL based on time frame
    switch (timeFrame) {
      case "1hour":
        url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${API_KEY}`;
        break;
      case "1day":
        url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
        break;
      case "1week":
        url = `${BASE_URL}?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${API_KEY}`;
        break;
      case "1month":
        url = `${BASE_URL}?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${API_KEY}`;
        break;
      case "1year":
        url = `${BASE_URL}?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${API_KEY}`;
        break;
      case "max":
        // For maximum data, use WEEKLY with outputsize=full to get all available data
        url = `${BASE_URL}?function=TIME_SERIES_WEEKLY&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`;
        break;
      default:
        url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    }

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }

    if (data["Note"]) {
      console.warn("API call frequency warning:", data["Note"]);
      // Return cached or mock data if API limit is reached
      return getMockStockData(symbol, timeFrame);
    }

    // Get the appropriate time series key based on the time frame
    const timeSeriesKey = getTimeSeriesKey(timeFrame);
    const timeSeriesData = data[timeSeriesKey];

    if (!timeSeriesData) {
      throw new Error("No time series data available");
    }

    const dates = Object.keys(timeSeriesData).sort().reverse();
    const stockData: StockData[] = dates.slice(0, 30).map((date) => {
      const dailyData = timeSeriesData[date];
      return {
        symbol,
        date,
        open: Number.parseFloat(dailyData["1. open"]),
        high: Number.parseFloat(dailyData["2. high"]),
        low: Number.parseFloat(dailyData["3. low"]),
        close: Number.parseFloat(dailyData["4. close"]),
        volume: Number.parseFloat(dailyData["5. volume"]),
      };
    });

    const latestPrice = stockData[0].close;
    const previousClose = stockData[1]?.close || stockData[0].open;
    const change = latestPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    return {
      data: stockData,
      latestPrice,
      previousClose,
      change,
      changePercent,
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return getMockStockData(symbol, timeFrame);
  }
}

function getTimeSeriesKey(timeFrame: TimeFrame): string {
  switch (timeFrame) {
    case "1hour":
      return "Time Series (60min)";
    case "1day":
      return "Time Series (Daily)";
    case "1week":
    case "max":
      return "Weekly Time Series";
    case "1month":
    case "1year":
      return "Monthly Time Series";
    default:
      return "Time Series (Daily)";
  }
}

// Fallback mock data in case of API limits or errors
function getMockStockData(
  symbol: string,
  timeFrame: TimeFrame = "1day"
): StockDataResponse {
  const mockPrices: Record<string, number> = {
    AAPL: 182.52,
    MSFT: 417.88,
    AMZN: 178.75,
    GOOGL: 163.42,
    TSLA: 177.58,
    META: 474.99,
    NVDA: 950.02,
    JPM: 198.47,
    V: 275.96,
    WMT: 68.23,
    JNJ: 152.5,
    PG: 165.87,
    XOM: 118.75,
    BAC: 38.92,
    KO: 62.34,
  };

  const basePrice = mockPrices[symbol] || 100 + Math.random() * 200;
  const change = Math.random() * 6 - 3;
  const changePercent = (change / basePrice) * 100;

  const data: StockData[] = [];
  let currentPrice = basePrice;

  // Number of data points to generate based on time frame
  let dataPoints = 30;
  let dayMultiplier = 1;

  switch (timeFrame) {
    case "1hour":
      dataPoints = 24; // 24 hours
      dayMultiplier = 1 / 24;
      break;
    case "1day":
      dataPoints = 30; // 30 days
      break;
    case "1week":
      dataPoints = 12; // 12 weeks
      dayMultiplier = 7;
      break;
    case "1month":
      dataPoints = 12; // 12 months
      dayMultiplier = 30;
      break;
    case "1year":
      dataPoints = 52; // 52 weeks in a year
      dayMultiplier = 7; // Weekly data points for a year
      break;
    case "max":
      dataPoints = 100; // 100 data points for maximum view
      dayMultiplier = 30; // Monthly spacing for a long-term view
      break;
  }

  // Generate mock data with a realistic trend
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i * dayMultiplier);

    // Format date string based on time frame
    let dateStr: string;
    if (timeFrame === "1hour") {
      date.setHours(date.getHours() - i);
      dateStr = date.toISOString().replace(/T/, " ").replace(/\..+/, "");
    } else {
      dateStr = date.toISOString().split("T")[0];
    }

    // Create a somewhat realistic price movement
    const volatilityFactor = timeFrame === "1hour" ? 0.5 : 1;
    const dailyChange =
      (Math.random() * 4 - 2) * (symbol === "NVDA" ? 2 : 1) * volatilityFactor;
    currentPrice += dailyChange;

    // Ensure price doesn't go negative
    if (currentPrice < 1) currentPrice = basePrice * 0.8;

    const dailyHigh = currentPrice + Math.random() * 2;
    const dailyLow = currentPrice - Math.random() * 2;

    data.push({
      symbol,
      date: dateStr,
      open: currentPrice - Math.random(),
      high: dailyHigh,
      low: dailyLow > 0 ? dailyLow : 0.1,
      close: currentPrice,
      volume: Math.floor(1000000 + Math.random() * 10000000),
    });
  }

  return {
    data,
    latestPrice: basePrice,
    previousClose: basePrice - change,
    change,
    changePercent,
  };
}
