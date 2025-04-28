"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { List, PieChartIcon, Network, Clock, TrendingUp, TrendingDown, Minus, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock news data
const newsData = [
  {
    id: 1,
    title: "Fed Signals Potential Rate Cut in September",
    source: "Financial Times",
    time: "2 hours ago",
    sentiment: "positive",
    categories: ["Federal Reserve", "Interest Rates", "Economy"],
    impact: 85,
    relatedTo: ["Economy", "Markets", "Banking"],
  },
  {
    id: 2,
    title: "Tech Stocks Rally as Earnings Beat Expectations",
    source: "Wall Street Journal",
    time: "4 hours ago",
    sentiment: "positive",
    categories: ["Technology", "Earnings", "Stock Market"],
    impact: 72,
    relatedTo: ["AAPL", "MSFT", "NVDA", "Technology"],
  },
  {
    id: 3,
    title: "Oil Prices Drop Amid Global Demand Concerns",
    source: "Bloomberg",
    time: "6 hours ago",
    sentiment: "negative",
    categories: ["Oil & Gas", "Commodities", "Global Economy"],
    impact: 65,
    relatedTo: ["XOM", "Energy", "Economy"],
  },
  {
    id: 4,
    title: "Housing Market Shows Signs of Cooling",
    source: "CNBC",
    time: "8 hours ago",
    sentiment: "neutral",
    categories: ["Real Estate", "Housing", "Economy"],
    impact: 58,
    relatedTo: ["Real Estate", "Economy", "Interest Rates"],
  },
  {
    id: 5,
    title: "Retail Sales Decline for Second Consecutive Month",
    source: "Reuters",
    time: "10 hours ago",
    sentiment: "negative",
    categories: ["Retail", "Consumer Spending", "Economy"],
    impact: 63,
    relatedTo: ["WMT", "Consumer", "Economy"],
  },
  {
    id: 6,
    title: "Cryptocurrency Market Stabilizes After Volatile Week",
    source: "CoinDesk",
    time: "12 hours ago",
    sentiment: "neutral",
    categories: ["Cryptocurrency", "Bitcoin", "Digital Assets"],
    impact: 55,
    relatedTo: ["BTC", "ETH", "Crypto"],
  },
  {
    id: 7,
    title: "NVIDIA Announces New AI Chip, Stock Surges",
    source: "TechCrunch",
    time: "3 hours ago",
    sentiment: "positive",
    categories: ["Technology", "AI", "Semiconductors"],
    impact: 78,
    relatedTo: ["NVDA", "Technology", "AI"],
  },
  {
    id: 8,
    title: "Healthcare Stocks Underperform as Reform Talks Resume",
    source: "MarketWatch",
    time: "5 hours ago",
    sentiment: "negative",
    categories: ["Healthcare", "Policy", "Stocks"],
    impact: 62,
    relatedTo: ["JNJ", "Healthcare", "Policy"],
  },
  {
    id: 9,
    title: "Bank of America Reports Strong Q2 Earnings",
    source: "Yahoo Finance",
    time: "7 hours ago",
    sentiment: "positive",
    categories: ["Banking", "Earnings", "Financials"],
    impact: 70,
    relatedTo: ["BAC", "JPM", "Banking"],
  },
  {
    id: 10,
    title: "Consumer Confidence Index Rises Unexpectedly",
    source: "Bloomberg",
    time: "9 hours ago",
    sentiment: "positive",
    categories: ["Economy", "Consumer Spending", "Retail"],
    impact: 68,
    relatedTo: ["Consumer", "Economy", "WMT", "KO"],
  },
]

// Data for pie chart
const sentimentData = [
  { name: "Positive", value: 4, color: "#22c55e" },
  { name: "Neutral", value: 2, color: "#f59e0b" },
  { name: "Negative", value: 4, color: "#ef4444" },
]

// Data for network graph
const generateGraphData = () => {
  // Extract unique nodes from news data
  const nodeSet = new Set<string>()
  const nodes: any[] = []
  const links: any[] = []

  // Add news items as nodes
  newsData.forEach((news) => {
    nodeSet.add(`news-${news.id}`)

    // Add related entities
    news.categories.forEach((cat) => nodeSet.add(cat))
    news.relatedTo.forEach((rel) => nodeSet.add(rel))
  })

  // Create node objects
  nodeSet.forEach((id) => {
    const isNews = id.startsWith("news-")
    let group = 1
    let size = 5

    if (isNews) {
      group = 2
      const newsId = Number.parseInt(id.split("-")[1])
      const news = newsData.find((n) => n.id === newsId)
      size = news ? news.impact / 10 : 5
    } else if (id.includes("Economy")) {
      group = 3
      size = 10
    } else if (id.length <= 5 && id === id.toUpperCase()) {
      group = 4 // Stock ticker
      size = 8
    } else {
      group = 5 // Category
      size = 7
    }

    nodes.push({
      id,
      group,
      size,
    })
  })

  // Create links between news and related entities
  newsData.forEach((news) => {
    const newsNodeId = `news-${news.id}`

    // Link to categories
    news.categories.forEach((cat) => {
      links.push({
        source: newsNodeId,
        target: cat,
        value: 1,
      })
    })

    // Link to related entities
    news.relatedTo.forEach((rel) => {
      links.push({
        source: newsNodeId,
        target: rel,
        value: 2,
      })
    })
  })

  return { nodes, links }
}

export function NewsAnalysis() {
  const [viewType, setViewType] = useState<"list" | "pie" | "graph">("list")
  const [isExpanded, setIsExpanded] = useState(false)
  const graphRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (viewType === "graph" && graphRef.current) {
      renderGraph()
    }
  }, [viewType])

  const renderGraph = () => {
    if (!graphRef.current) return

    // This would be where we'd initialize the graph visualization
    // For a real implementation, we'd use a library like D3.js or react-force-graph
    console.log("Rendering graph with data:", generateGraphData())
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "negative":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    }
  }

  return (
    <div
      className={`space-y-4 ${isExpanded ? "fixed inset-4 z-50 bg-background p-6 overflow-auto rounded-lg shadow-lg" : ""}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Financial News Impact</h3>
        <div className="flex space-x-1">
          <div className="border rounded-md mr-2">
            <button
              onClick={() => setViewType("list")}
              className={`p-1.5 ${viewType === "list" ? "bg-muted" : ""}`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType("pie")}
              className={`p-1.5 ${viewType === "pie" ? "bg-muted" : ""}`}
              aria-label="Pie chart view"
            >
              <PieChartIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType("graph")}
              className={`p-1.5 ${viewType === "graph" ? "bg-muted" : ""}`}
              aria-label="Relational graph view"
            >
              <Network className="h-4 w-4" />
            </button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {viewType === "list" && (
        <div className={`space-y-3 ${isExpanded ? "max-h-[calc(100vh-150px)]" : "max-h-[400px]"} overflow-y-auto pr-1`}>
          {newsData.map((news) => (
            <Card key={news.id} className="hover:bg-accent/50 cursor-pointer transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getSentimentIcon(news.sentiment)}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{news.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span>{news.source}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{news.time}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {news.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      <Badge className={`text-xs ${getSentimentColor(news.sentiment)}`}>
                        {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="font-medium">
                      {news.impact}% Impact
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewType === "pie" && (
        <div className={`${isExpanded ? "h-[calc(100vh-150px)]" : "h-[400px]"} flex items-center justify-center`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {viewType === "graph" && (
        <div
          ref={graphRef}
          className={`${isExpanded ? "h-[calc(100vh-150px)]" : "h-[400px]"} bg-muted/20 rounded-lg relative overflow-hidden`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">News Relationship Graph</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                This visualization shows connections between news events, stocks, and market factors.
              </p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 max-w-md mx-auto">
                {newsData.slice(0, 8).map((news) => (
                  <div key={news.id} className="flex items-center text-xs p-1 border rounded">
                    {getSentimentIcon(news.sentiment)}
                    <span className="ml-1 truncate">{news.title.substring(0, 20)}...</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
