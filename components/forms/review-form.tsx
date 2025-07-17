'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Users, Building, Gavel, Eye, Calendar, MapPin } from 'lucide-react'
import { useState } from 'react'

interface ReviewFormProps {
  willData?: any
  onSave: (data: any) => void
  onGenerateWill: () => void
  isLoading: boolean
}

export function ReviewForm({ willData, onSave, onGenerateWill, isLoading }: ReviewFormProps) {
  const [dateOfWill, setDateOfWill] = useState(new Date().toISOString().split('T')[0])
  const [placeOfWill, setPlaceOfWill] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [liabilities, setLiabilities] = useState('')

  if (!willData) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No data to review. Please complete the previous steps.</p>
        </CardContent>
      </Card>
    )
  }

  const sections = [
    {
      title: 'Testator Information',
      icon: <FileText className="h-5 w-5" />,
      data: willData.testator,
      fields: ['fullName', 'age', 'occupation', 'address', 'idNumber'],
    },
    {
      title: 'Beneficiaries',
      icon: <Users className="h-5 w-5" />,
      data: willData.beneficiaries,
      isArray: true,
    },
    {
      title: 'Assets',
      icon: <Building className="h-5 w-5" />,
      data: {
        bankAccounts: willData.bankAccounts?.length || 0,
        insurancePolicies: willData.insurancePolicies?.length || 0,
        stocks: willData.stocks?.length || 0,
        mutualFunds: willData.mutualFunds?.length || 0,
        jewellery: willData.jewellery?.length || 0,
        immovableAssets: willData.immovableAssets?.length || 0,
      },
    },
    {
      title: 'Executors',
      icon: <Gavel className="h-5 w-5" />,
      data: willData.executors,
      isArray: true,
    },
    {
      title: 'Witnesses',
      icon: <Eye className="h-5 w-5" />,
      data: willData.witnesses,
      isArray: true,
    },
  ]

  const handleSaveAndGenerate = () => {
    // Save final details first
    onSave({
      dateOfWill,
      placeOfWill,
      specialInstructions: specialInstructions || undefined,
      liabilities: liabilities ? liabilities.split('\n').filter(l => l.trim()) : [],
    })
    
    // Then generate the will
    setTimeout(() => {
      onGenerateWill()
    }, 500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Will</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Please review all the information below and complete the final details before generating your will document.
          </p>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  {section.icon}
                  <h3 className="font-semibold">{section.title}</h3>
                  {section.isArray && section.data && (
                    <Badge variant="secondary">
                      {Array.isArray(section.data) ? section.data.length : 0} items
                    </Badge>
                  )}
                </div>

                {section.isArray ? (
                  <div className="space-y-2">
                    {Array.isArray(section.data) && section.data.length > 0 ? (
                      section.data.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="bg-muted p-3 rounded">
                          <p className="font-medium">{item.name}</p>
                          {item.relation && (
                            <p className="text-sm text-muted-foreground">
                              Relation: {item.relation}
                            </p>
                          )}
                          {item.occupation && (
                            <p className="text-sm text-muted-foreground">
                              Occupation: {item.occupation}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No items added</p>
                    )}
                  </div>
                ) : section.title === 'Assets' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(section.data).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-2xl font-bold text-primary">{value as number}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {section.fields?.map((field) => (
                      <div key={field} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span>{section.data?.[field] || 'Not provided'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Final Details */}
      <Card>
        <CardHeader>
          <CardTitle>Final Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfWill">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date of Will *
              </Label>
              <Input
                id="dateOfWill"
                type="date"
                value={dateOfWill}
                onChange={(e) => setDateOfWill(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeOfWill">
                <MapPin className="h-4 w-4 inline mr-2" />
                Place of Will *
              </Label>
              <Input
                id="placeOfWill"
                value={placeOfWill}
                onChange={(e) => setPlaceOfWill(e.target.value)}
                placeholder="Enter place where will is signed"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="liabilities">Liabilities (Optional)</Label>
            <Textarea
              id="liabilities"
              value={liabilities}
              onChange={(e) => setLiabilities(e.target.value)}
              placeholder="Enter any debts or liabilities (one per line)"
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              List any debts, loans, or financial obligations that should be settled from your estate
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
            <Textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special instructions or wishes..."
              rows={4}
            />
          </div>

          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleSaveAndGenerate} 
              disabled={isLoading || !placeOfWill.trim()} 
              size="lg"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isLoading ? 'Generating Will...' : 'Generate Will Document'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}