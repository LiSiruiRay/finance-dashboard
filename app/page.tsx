import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MarketOverview } from "@/components/market-overview"
import { PortfolioSidebar } from "@/components/portfolio-sidebar"
import { NewsAnalysis } from "@/components/news-analysis"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      {/* Left sidebar for portfolio */}
      <PortfolioSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b p-4">
          <h1 className="text-2xl font-bold">Financial Advisor Dashboard</h1>
        </header>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Stock market section (top right) */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Stock Performance</CardTitle>
              <CardDescription>
                Click on any stock in the Top Performers list to view its individual chart
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <MarketOverview type="market" />
            </CardContent>
          </Card>

          {/* News analysis section (bottom right) - emphasized */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle>News Analysis</CardTitle>
              <CardDescription>Financial news and market sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsAnalysis />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
