'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface RiskData {
  level: 'low' | 'medium' | 'high'
  score: number
  factors: {
    name: string
    severity: 'low' | 'medium' | 'high'
    value: string
  }[]
}

interface RiskAssessmentProps {
  data: RiskData | null
}

export default function RiskAssessment({ data }: RiskAssessmentProps) {
  if (!data) {
    return (
      <Card className="border-primary/20 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Risk Assessment</CardTitle>
          <CardDescription>Select an asteroid to view risk analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No asteroid selected</p>
        </CardContent>
      </Card>
    )
  }

  const riskColors = {
    low: 'bg-secondary',
    medium: 'bg-accent',
    high: 'bg-destructive',
  }

  const riskBgColors = {
    low: 'bg-secondary/10 border-secondary/30',
    medium: 'bg-accent/10 border-accent/30',
    high: 'bg-destructive/10 border-destructive/30',
  }

  const factorSeverityColors = {
    low: 'border-secondary/30 bg-secondary/10',
    medium: 'border-accent/30 bg-accent/10',
    high: 'border-destructive/30 bg-destructive/10',
  }

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">Risk Assessment</CardTitle>
        <CardDescription>Impact probability analysis</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Risk Score */}
        <div className={`p-4 rounded-lg border ${riskBgColors[data.level]}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Overall Risk Score</span>
            <span className="text-2xl font-bold text-foreground">{data.score}%</span>
          </div>
          <Progress value={data.score} className="h-2" />
          <div className="mt-3 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${riskColors[data.level]}`} />
            <span className="text-xs font-semibold uppercase text-foreground">
              {data.level} Risk
            </span>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Key Factors</h4>
          {data.factors.map((factor, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${factorSeverityColors[factor.severity]} space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{factor.name}</span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {factor.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{factor.value}</p>
            </div>
          ))}
        </div>

        {/* Recommendations */}
      </CardContent>
    </Card>
  )
}
