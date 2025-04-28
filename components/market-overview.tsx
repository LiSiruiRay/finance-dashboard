"use client"

import { useState, useEffect } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { fetchStockData, type StockDataResponse } from "@/lib/api"
import { Toggle } from "@/components/ui/toggle"

// Top stocks to display in the market overview
const topStocks = ["AAPL", "MSFT", "AMZN", "GOOGL", "NVDA"]

// Time frame options
type TimeFrame = "1hour" | "1day" | "1week" | "1month"

interface MarketOverviewProps {
  type: "personal" | "market"
}

export function MarketOverview({ type }: MarketOverviewProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [stocksData, setStocksData] = useState<Record<string, StockDataResponse>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1day")

  useEffect(() => {
    loadStockData()
  }, [timeFrame])

  async function loadStockData() {
    setIsLoading(true)
    const stockPromises = topStocks.map((symbol) => fetchStockData(symbol, timeFrame))
    const results = await Promise.all(stockPromises)

    const stocksMap: Record<string, StockDataResponse> = {}
    topStocks.forEach((symbol, index) => {
      stocksMap[symbol] = results[index]
    })

    setStocksData(stocksMap)
    setIsLoading(false)
  }

  // Prepare chart data for the selected stock or market overview
  const getChartData = () => {
    if (selectedStock && stocksData[selectedStock]) {
      return stocksData[selectedStock].data
        .map((item) => ({
          date: item.date,
          value: item.close,
        }))
        .reverse()
    } else if (Object.keys(stocksData).length > 0) {
      // For market overview, use the first stock's dates but average the values
      const dates = stocksData[topStocks[0]].data.map((item) => item.date)
      return dates
        .map((date, index) => {
          const avgValue =
            Object.values(stocksData).reduce((sum, stock) => {
              const dataPoint = stock.data.find((item) => item.date === date)
              return sum + (dataPoint ? dataPoint.close : 0)
            }, 0) / Object.keys(stocksData).length

          return {
            date,
            value: avgValue,
          }
        })
        .reverse()
    }
    return []
  }

  const chartData = getChartData()

  const title = selectedStock
    ? `${selectedStock} Performance`
    : type === "personal"
      ? "Portfolio Performance"
      : "Market Overview"

  // Calculate values based on selected stock or overall market
  const getValue = () => {
    if (selectedStock && stocksData[selectedStock]) {
      return stocksData[selectedStock].latestPrice
    } else {
      return (
        Object.values(stocksData).reduce((sum, stock) => sum + stock.latestPrice, 0) / Object.keys(stocksData).length
      )
    }
  }

  const getChange = () => {
    if (selectedStock && stocksData[selectedStock]) {
      return stocksData[selectedStock].changePercent
    } else {
      return (
        Object.values(stocksData).reduce((sum, stock) => sum + stock.changePercent, 0) / Object.keys(stocksData).length
      )
    }
  }

  const value = getValue()
  const changePercent = getChange()
  const isPositive = changePercent >= 0

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">Toggle {title}</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading market data...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold">${value.toFixed(2)}</h3>
                  </div>
                  <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center">
                    {isPositive ? (
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                    )}
                    {isPositive ? "+" : ""}
                    {changePercent.toFixed(2)}%
                  </Badge>
                </div>
                
                <div className="flex justify-between my-3 border rounded-md p-1">
                  <Toggle
                    pressed={timeFrame === "1hour"}
                    onPressedChange={() => setTimeFrame("1hour")}
                    size="sm"
                    variant="outline"
                    className="text-xs flex-1"
                  >
                    1H
                  </Toggle>
                  <Toggle
                    pressed={timeFrame === "1day"}
                    onPressedChange={() => setTimeFrame("1day")}
                    size="sm"
                    variant="outline"
                    className="text-xs flex-1"
                  >
                    1D
                  </Toggle>
                  <Toggle
                    pressed={timeFrame === "1week"}
                    onPressedChange={() => setTimeFrame("1week")}
                    size="sm"
                    variant="outline"
                    className="text-xs flex-1"
                  >
                    1W
                  </Toggle>
                  <Toggle
                    pressed={timeFrame === "1month"}
                    onPressedChange={() => setTimeFrame("1month")}
                    size="sm"
                    variant="outline"
                    className="text-xs flex-1"
                  >
                    1M
                  </Toggle>
                </div>
                
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                          <stop offset="50%" stopColor="#22c55e" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                        </linearGradient>
                        <filter id="shadow" height="200%" width="100%">
                          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#22c55e" floodOpacity="0.3" />
                        </filter>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis domain={["auto", "auto"]} />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        filter="url(#shadow)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {selectedStock && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setSelectedStock(null)}>
                      Back to {type === "personal" ? "Portfolio" : "Market"} Overview
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Top Performers</h3>
              <div className="space-y-2">
                {Object.entries(stocksData).map(([symbol, data]) => (
                  <div
                    key={symbol}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedStock === symbol ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedStock(symbol)}
                  >
                    <div>
                      <div className="font-medium">{symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {topStocks.includes(symbol) ? "Market Leader" : "Your Portfolio"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${data.latestPrice.toFixed(2)}</div>
                      <div className={data.change > 0 ? "text-green-500" : "text-red-500"}>
                        {data.change > 0 ? "+" : ""}
                        {data.change.toFixed(2)} ({data.change > 0 ? "+" : ""}
                        {data.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
