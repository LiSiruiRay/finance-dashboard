"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchStockData } from "@/lib/api"

// Expanded portfolio data
const portfolioStocks = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 10 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 5 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 8 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 6 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 4 },
  { symbol: "META", name: "Meta Platforms Inc.", shares: 7 },
  { symbol: "NVDA", name: "NVIDIA Corp.", shares: 3 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", shares: 12 },
  { symbol: "V", name: "Visa Inc.", shares: 9 },
  { symbol: "WMT", name: "Walmart Inc.", shares: 15 },
  { symbol: "JNJ", name: "Johnson & Johnson", shares: 8 },
  { symbol: "PG", name: "Procter & Gamble Co.", shares: 10 },
  { symbol: "XOM", name: "Exxon Mobil Corp.", shares: 14 },
  { symbol: "BAC", name: "Bank of America Corp.", shares: 20 },
  { symbol: "KO", name: "Coca-Cola Co.", shares: 18 },
]

const cryptoData = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.5,
    price: 63245.78,
    value: 31622.89,
    change: 1254.32,
    changePercent: 2.02,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: 2.5,
    price: 3052.67,
    value: 7631.68,
    change: -87.45,
    changePercent: -2.79,
  },
  { symbol: "SOL", name: "Solana", amount: 15, price: 142.56, value: 2138.4, change: 3.21, changePercent: 2.3 },
  { symbol: "ADA", name: "Cardano", amount: 1000, price: 0.45, value: 450.0, change: 0.01, changePercent: 2.27 },
  { symbol: "DOT", name: "Polkadot", amount: 75, price: 5.87, value: 440.25, change: 0.15, changePercent: 2.62 },
  { symbol: "AVAX", name: "Avalanche", amount: 30, price: 28.45, value: 853.5, change: 1.23, changePercent: 4.52 },
  { symbol: "LINK", name: "Chainlink", amount: 100, price: 13.76, value: 1376.0, change: 0.42, changePercent: 3.15 },
  { symbol: "MATIC", name: "Polygon", amount: 2000, price: 0.58, value: 1160.0, change: -0.02, changePercent: -3.33 },
]

export function PortfolioSidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(true)
  const [stocksWithData, setStocksWithData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPortfolioData() {
      setIsLoading(true)

      try {
        const stockPromises = portfolioStocks.map(async (stock) => {
          const data = await fetchStockData(stock.symbol)
          return {
            ...stock,
            price: data.latestPrice,
            value: data.latestPrice * stock.shares,
            change: data.change,
            changePercent: data.changePercent,
          }
        })

        const results = await Promise.all(stockPromises)
        setStocksWithData(results)
      } catch (error) {
        console.error("Error loading portfolio data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolioData()
  }, [])

  const filteredStocks = stocksWithData.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredCrypto = cryptoData.filter(
    (crypto) =>
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate total portfolio values
  const totalStocksValue = stocksWithData.reduce((sum, stock) => sum + stock.value, 0)
  const totalCryptoValue = cryptoData.reduce((sum, crypto) => sum + crypto.value, 0)

  // Calculate average change percentages
  const avgStockChange =
    stocksWithData.length > 0
      ? stocksWithData.reduce((sum, stock) => sum + stock.changePercent, 0) / stocksWithData.length
      : 0

  const avgCryptoChange = cryptoData.reduce((sum, crypto) => sum + crypto.changePercent, 0) / cryptoData.length

  return (
    <div className={`relative h-full transition-all duration-300 ${isExpanded ? "w-80" : "w-12"}`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 z-10 h-8 w-8 rounded-full border bg-background shadow-md"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {isExpanded ? (
        <div className="space-y-4 h-full overflow-hidden">
          <h2 className="text-xl font-bold">My Portfolio</h2>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search assets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="stocks" className="h-[calc(100%-100px)]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>

            <TabsContent value="stocks" className="space-y-4 mt-4 h-full overflow-hidden">
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Total Value: ${totalStocksValue.toFixed(2)}</span>
                <span className={avgStockChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {avgStockChange >= 0 ? "+" : ""}
                  {avgStockChange.toFixed(2)}%
                </span>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-pulse text-muted-foreground">Loading portfolio...</div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
                  {filteredStocks.map((stock) => (
                    <Card key={stock.symbol} className="hover:bg-accent/50 cursor-pointer transition-colors">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">{stock.name}</div>
                            <div className="text-xs">{stock.shares} shares</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${stock.value.toFixed(2)}</div>
                            <div className={stock.change > 0 ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                              {stock.change > 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="crypto" className="space-y-4 mt-4 h-full overflow-hidden">
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Total Value: ${totalCryptoValue.toFixed(2)}</span>
                <span className={avgCryptoChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {avgCryptoChange >= 0 ? "+" : ""}
                  {avgCryptoChange.toFixed(2)}%
                </span>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
                {filteredCrypto.map((crypto) => (
                  <Card key={crypto.symbol} className="hover:bg-accent/50 cursor-pointer transition-colors">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{crypto.symbol}</div>
                          <div className="text-xs text-muted-foreground">{crypto.name}</div>
                          <div className="text-xs">
                            {crypto.amount} {crypto.symbol}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${crypto.value.toFixed(2)}</div>
                          <div className={crypto.change > 0 ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                            {crypto.change > 0 ? "+" : ""}
                            {crypto.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col items-center pt-12 space-y-6">
          <div className="rotate-90 whitespace-nowrap text-sm font-medium">My Portfolio</div>
        </div>
      )}
    </div>
  )
}
