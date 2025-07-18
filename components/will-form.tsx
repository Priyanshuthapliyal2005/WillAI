'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WillData, Beneficiary, BankAccount, InsurancePolicy, Stock, MutualFund, Jewellery, ImmovableAsset, Executor, Witness } from '@/types/will-types';
import { Plus, Trash2 } from 'lucide-react';

// Language mapping helper
const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French', 
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'hi': 'Hindi',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ru': 'Russian'
  };
  return languages[code] || code.toUpperCase();
};

interface WillFormProps {
  onSubmit: (data: WillData, language?: string) => void;
  isGenerating?: boolean;
}

export function WillForm({ onSubmit, isGenerating = false }: WillFormProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [formData, setFormData] = useState<WillData>({
    testator: {
      fullName: '',
      age: 0,
      occupation: '',
      address: '',
      idNumber: '',
    },
    beneficiaries: [],
    movableAssets: {
      bankAccounts: [],
      insurancePolicies: [],
      stocks: [],
      mutualFunds: [],
    },
    physicalAssets: {
      jewellery: [],
    },
    immovableAssets: [],
    liabilities: [],
    executors: [],
    witnesses: [],
    dateOfWill: new Date().toISOString().split('T')[0],
    placeOfWill: '',
    residualClause: '', // Add this line to satisfy WillData type
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, selectedLanguage);
  };

  // Beneficiary management
  const addBeneficiary = () => {
    const newBeneficiary: Beneficiary = {
      id: Date.now().toString(),
      name: '',
      relation: '',
      idNumber: '',
      address: '',
      age: 0,
    };
    setFormData(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, newBeneficiary]
    }));
  };

  const updateBeneficiary = (id: string, field: keyof Beneficiary, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.map(b => 
        b.id === id ? { ...b, [field]: value } : b
      )
    }));
  };

  const removeBeneficiary = (id: string) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter(b => b.id !== id)
    }));
  };

  // Bank Account management
  const addBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: '',
      accountNumber: '',
      accountType: '',
      branch: '',
      beneficiaryId: '',
      sharePercentage: ''
    };
    setFormData(prev => ({
      ...prev,
      movableAssets: {
        ...prev.movableAssets,
        bankAccounts: [...prev.movableAssets.bankAccounts, newAccount]
      }
    }));
  };

  const updateBankAccount = (id: string, field: keyof BankAccount, value: string) => {
    setFormData(prev => ({
      ...prev,
      movableAssets: {
        ...prev.movableAssets,
        bankAccounts: prev.movableAssets.bankAccounts.map(a => 
          a.id === id ? { ...a, [field]: value } : a
        )
      }
    }));
  };

  const removeBankAccount = (id: string) => {
    setFormData(prev => ({
      ...prev,
      movableAssets: {
        ...prev.movableAssets,
        bankAccounts: prev.movableAssets.bankAccounts.filter(a => a.id !== id)
      }
    }));
  };

  // Executor management
  const addExecutor = () => {
    const newExecutor: Executor = {
      id: Date.now().toString(),
      name: '',
      relation: '',
      address: '',
      phone: '',
      isPrimary: formData.executors.length === 0,
    };
    setFormData(prev => ({
      ...prev,
      executors: [...prev.executors, newExecutor]
    }));
  };

  const updateExecutor = (id: string, field: keyof Executor, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      executors: prev.executors.map(e => 
        e.id === id ? { ...e, [field]: value } : e
      )
    }));
  };

  const removeExecutor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      executors: prev.executors.filter(e => e.id !== id)
    }));
  };

  // Witness management
  const addWitness = () => {
    const newWitness: Witness = {
      id: Date.now().toString(),
      name: '',
      address: '',
      phone: '',
      occupation: '',
      idNumber: '',
    };
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, newWitness]
    }));
  };

  const updateWitness = (id: string, field: keyof Witness, value: string) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.map(w => 
        w.id === id ? { ...w, [field]: value } : w
      )
    }));
  };

  const removeWitness = (id: string) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.filter(w => w.id !== id)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="testator" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="testator">Testator</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="executors">Executors</TabsTrigger>
          <TabsTrigger value="witnesses">Witnesses</TabsTrigger>
          <TabsTrigger value="final">Final</TabsTrigger>
        </TabsList>

        {/* Testator Information */}
        <TabsContent value="testator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testator Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Legal Name</Label>
                  <Input
                    id="fullName"
                    value={formData.testator.fullName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      testator: { ...prev.testator, fullName: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.testator.age || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      testator: { ...prev.testator, age: parseInt(e.target.value) || 0 }
                    }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.testator.occupation}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      testator: { ...prev.testator, occupation: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    value={formData.testator.idNumber}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      testator: { ...prev.testator, idNumber: e.target.value }
                    }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Complete Address</Label>
                <Textarea
                  id="address"
                  value={formData.testator.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    testator: { ...prev.testator, address: e.target.value }
                  }))}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Beneficiaries */}
        <TabsContent value="beneficiaries" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Beneficiaries</CardTitle>
                <Button type="button" onClick={addBeneficiary} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Beneficiary
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.beneficiaries.map((beneficiary) => (
                <div key={beneficiary.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Beneficiary</h4>
                    <Button
                      type="button"
                      onClick={() => removeBeneficiary(beneficiary.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={beneficiary.name}
                        onChange={(e) => updateBeneficiary(beneficiary.id, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Relation to Testator</Label>
                      <Input
                        value={beneficiary.relation}
                        onChange={(e) => updateBeneficiary(beneficiary.id, 'relation', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>ID Number</Label>
                      <Input
                        value={beneficiary.idNumber}
                        onChange={(e) => updateBeneficiary(beneficiary.id, 'idNumber', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={beneficiary.age || ''}
                        onChange={(e) => updateBeneficiary(beneficiary.id, 'age', parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Complete Address</Label>
                    <Textarea
                      value={beneficiary.address}
                      onChange={(e) => updateBeneficiary(beneficiary.id, 'address', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              {formData.beneficiaries.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No beneficiaries added yet. Click "Add Beneficiary" to start.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assets */}
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bank Accounts</CardTitle>
                <Button type="button" onClick={addBankAccount} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.movableAssets.bankAccounts.map((account) => (
                <div key={account.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Bank Account</h4>
                    <Button
                      type="button"
                      onClick={() => removeBankAccount(account.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Bank Name</Label>
                      <Input
                        value={account.bankName}
                        onChange={(e) => updateBankAccount(account.id, 'bankName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input
                        value={account.accountNumber}
                        onChange={(e) => updateBankAccount(account.id, 'accountNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Account Type</Label>
                      <Select
                        value={account.accountType}
                        onValueChange={(value) => updateBankAccount(account.id, 'accountType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="savings">Savings Account</SelectItem>
                          <SelectItem value="current">Current Account</SelectItem>
                          <SelectItem value="fixed">Fixed Deposit</SelectItem>
                          <SelectItem value="recurring">Recurring Deposit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Branch</Label>
                      <Input
                        value={account.branch}
                        onChange={(e) => updateBankAccount(account.id, 'branch', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Beneficiary</Label>
                    <Select
                      value={account.beneficiaryId}
                      onValueChange={(value) => updateBankAccount(account.id, 'beneficiaryId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select beneficiary" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.beneficiaries.map((beneficiary) => (
                          <SelectItem key={beneficiary.id} value={beneficiary.id}>
                            {beneficiary.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              {formData.movableAssets.bankAccounts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No bank accounts added yet. Click "Add Account" to start.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Executors */}
        <TabsContent value="executors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Executors</CardTitle>
                <Button type="button" onClick={addExecutor} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Executor
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.executors.map((executor) => (
                <div key={executor.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      {executor.isPrimary ? 'Primary Executor' : 'Executor'}
                    </h4>
                    <Button
                      type="button"
                      onClick={() => removeExecutor(executor.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={executor.name}
                        onChange={(e) => updateExecutor(executor.id, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Relation to Testator</Label>
                      <Input
                        value={executor.relation}
                        onChange={(e) => updateExecutor(executor.id, 'relation', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        value={executor.phone}
                        onChange={(e) => updateExecutor(executor.id, 'phone', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Email (Optional)</Label>
                      <Input
                        type="email"
                        value={executor.email || ''}
                        onChange={(e) => updateExecutor(executor.id, 'email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Complete Address</Label>
                    <Textarea
                      value={executor.address}
                      onChange={(e) => updateExecutor(executor.id, 'address', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              {formData.executors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No executors added yet. Click "Add Executor" to start.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Witnesses */}
        <TabsContent value="witnesses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Witnesses</CardTitle>
                <Button type="button" onClick={addWitness} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Witness
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.witnesses.map((witness) => (
                <div key={witness.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Witness</h4>
                    <Button
                      type="button"
                      onClick={() => removeWitness(witness.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={witness.name}
                        onChange={(e) => updateWitness(witness.id, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Occupation</Label>
                      <Input
                        value={witness.occupation}
                        onChange={(e) => updateWitness(witness.id, 'occupation', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        value={witness.phone}
                        onChange={(e) => updateWitness(witness.id, 'phone', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>ID Number</Label>
                      <Input
                        value={witness.idNumber}
                        onChange={(e) => updateWitness(witness.id, 'idNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Complete Address</Label>
                    <Textarea
                      value={witness.address}
                      onChange={(e) => updateWitness(witness.id, 'address', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              {formData.witnesses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No witnesses added yet. Click "Add Witness" to start.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final Details */}
        <TabsContent value="final" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Final Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfWill">Date of Will</Label>
                  <Input
                    id="dateOfWill"
                    type="date"
                    value={formData.dateOfWill}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dateOfWill: e.target.value
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="placeOfWill">Place of Will</Label>
                  <Input
                    id="placeOfWill"
                    value={formData.placeOfWill}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      placeOfWill: e.target.value
                    }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    specialInstructions: e.target.value
                  }))}
                  placeholder="Any special instructions or wishes..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Document Language</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Select Document Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English (Manual - Fast)</SelectItem>
                      <SelectItem value="es">🇪🇸 Spanish (AI-Generated)</SelectItem>
                      <SelectItem value="fr">🇫🇷 French (AI-Generated)</SelectItem>
                      <SelectItem value="de">🇩🇪 German (AI-Generated)</SelectItem>
                      <SelectItem value="it">🇮🇹 Italian (AI-Generated)</SelectItem>
                      <SelectItem value="pt">🇵🇹 Portuguese (AI-Generated)</SelectItem>
                      <SelectItem value="hi">🇮🇳 Hindi (AI-Generated)</SelectItem>
                      <SelectItem value="ar">🇸🇦 Arabic (AI-Generated)</SelectItem>
                      <SelectItem value="zh">🇨🇳 Chinese (AI-Generated)</SelectItem>
                      <SelectItem value="ja">🇯🇵 Japanese (AI-Generated)</SelectItem>
                      <SelectItem value="ko">🇰🇷 Korean (AI-Generated)</SelectItem>
                      <SelectItem value="ru">🇷🇺 Russian (AI-Generated)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedLanguage !== 'en' && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>AI-Generated Document:</strong> This will create a comprehensive legal document 
                      in {getLanguageName(selectedLanguage)} using advanced AI translation and localization. 
                      The document will include proper legal terminology for your selected language.
                    </p>
                  </div>
                )}
                
                {selectedLanguage === 'en' && (
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Manual Template:</strong> Fast, reliable document generation with 
                      professional formatting and comprehensive legal sections.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="lg" 
              className="px-8" 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                  Generating Will...
                </div>
              ) : (
                selectedLanguage === 'en' ? 'Generate Will Document' : `Generate Will in ${getLanguageName(selectedLanguage)}`
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}