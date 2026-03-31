import { useState } from 'react';
import { 
  Wallet, 
  CreditCard, 
  History, 
  Crown, 
  Zap, 
  Eye, 
  TrendingUp, 
  Send,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuthStore, useBalanceStore } from '@/store';
import { subscriptionPlans, microservices } from '@/store';
import { mockTransactions } from '@/data/mock';

const depositAmounts = [5, 20, 50, 100];

export function BalancePage() {
  const { user, updateUser } = useAuthStore();
  const { deposit, purchase } = useBalanceStore();
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDeposit, setSelectedDeposit] = useState(50);

  const handleDeposit = async () => {
    const bonus = selectedDeposit >= 50 ? selectedDeposit * 0.1 : 0;
    const total = selectedDeposit + bonus;
    await deposit(total, 'Stripe');
    updateUser({ balance: (user?.balance || 0) + total });
    setShowDepositDialog(false);
  };

  const handleSubscribe = async () => {
    if (selectedPlan) {
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      if (plan) {
        await purchase(plan.price, `${plan.name} subscription`);
        updateUser({ 
          subscriptionType: selectedPlan as any,
          balance: (user?.balance || 0) - plan.price 
        });
        setShowSubscribeDialog(false);
      }
    }
  };

  const handleMicroservice = async (service: typeof microservices[0]) => {
    await purchase(service.price, service.name);
    updateUser({ balance: (user?.balance || 0) - service.price });
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Balance & Payments
        </h1>
        <p className="text-gray-600">
          Manage your balance, subscriptions, and transactions
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <Badge className="bg-white/20 text-white">Available</Badge>
            </div>
            <p className="text-white/80 text-sm mb-1">Current Balance</p>
            <p className="text-4xl font-bold">${user?.balance.toFixed(2)}</p>
            <Button 
              className="w-full mt-4 bg-white text-amber-600 hover:bg-white/90"
              onClick={() => setShowDepositDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <Badge variant="secondary">
                {user?.subscriptionType === 'free' ? 'Free' : 'Active'}
              </Badge>
            </div>
            <p className="text-gray-500 text-sm mb-1">Current Plan</p>
            <p className="text-2xl font-bold text-gray-900 capitalize">
              {user?.subscriptionType?.replace('_', ' ')}
            </p>
            {user?.subscriptionType === 'free' && (
              <Button 
                className="w-full mt-4 bg-purple-500 hover:bg-purple-600"
                onClick={() => setShowSubscribeDialog(true)}
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <History className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              ${mockTransactions
                .filter(t => t.type === 'purchase' || t.type === 'subscription')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                .toFixed(2)}
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => document.getElementById('transactions-tab')?.click()}
            >
              View History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger id="transactions-tab" value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {microservices.map((service) => (
              <Card key={service.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      service.id === 'open_contacts' ? 'bg-blue-100' :
                      service.id === 'boost_profile' ? 'bg-green-100' :
                      service.id === 'who_viewed' ? 'bg-purple-100' :
                      'bg-amber-100'
                    }`}>
                      {service.id === 'open_contacts' && <CreditCard className="w-5 h-5 text-blue-600" />}
                      {service.id === 'extra_request' && <Send className="w-5 h-5 text-amber-600" />}
                      {service.id === 'boost_profile' && <TrendingUp className="w-5 h-5 text-green-600" />}
                      {service.id === 'who_viewed' && <Eye className="w-5 h-5 text-purple-600" />}
                      {service.id === 'urgent_request' && <Zap className="w-5 h-5 text-red-600" />}
                    </div>
                    <span className="text-xl font-bold text-amber-600">${service.price}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    disabled={(user?.balance || 0) < service.price}
                    onClick={() => handleMicroservice(service)}
                  >
                    {(user?.balance || 0) < service.price ? 'Insufficient Balance' : 'Purchase'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions">
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`border-2 ${user?.subscriptionType === plan.id ? 'border-amber-500' : 'border-gray-200'}`}
              >
                <CardContent className="p-6">
                  {user?.subscriptionType === plan.id && (
                    <Badge className="bg-amber-500 mb-4">Current Plan</Badge>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      user?.subscriptionType === plan.id 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                    disabled={user?.subscriptionType === plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setShowSubscribeDialog(true);
                    }}
                  >
                    {user?.subscriptionType === plan.id ? 'Active' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-green-100' :
                        transaction.type === 'purchase' ? 'bg-amber-100' :
                        'bg-purple-100'
                      }`}>
                        {transaction.type === 'deposit' && <Plus className="w-5 h-5 text-green-600" />}
                        {transaction.type === 'purchase' && <Wallet className="w-5 h-5 text-amber-600" />}
                        {transaction.type === 'subscription' && <Crown className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()} • {transaction.paymentMethod || 'Balance'}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds to Your Balance</DialogTitle>
            <DialogDescription>
              Choose an amount to deposit. Get 10% bonus on $50+ deposits.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {depositAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedDeposit(amount)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    selectedDeposit === amount
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-2xl font-bold">${amount}</p>
                  {amount >= 50 && (
                    <p className="text-xs text-green-600">+${(amount * 0.1).toFixed(0)} bonus</p>
                  )}
                </button>
              ))}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Deposit amount</span>
                <span className="font-medium">${selectedDeposit}</span>
              </div>
              {selectedDeposit >= 50 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Bonus (10%)</span>
                  <span>+${(selectedDeposit * 0.1).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl text-amber-600">
                  ${(selectedDeposit + (selectedDeposit >= 50 ? selectedDeposit * 0.1 : 0)).toFixed(2)}
                </span>
              </div>
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600"
              onClick={handleDeposit}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay with Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscribe Dialog */}
      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              You are about to subscribe to {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium">{subscriptionPlans.find(p => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price</span>
                <span className="font-medium">${subscriptionPlans.find(p => p.id === selectedPlan)?.price}/month</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Your balance</span>
                <span className="font-bold">${user?.balance.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowSubscribeDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-amber-500 hover:bg-amber-600"
                disabled={(user?.balance || 0) < (subscriptionPlans.find(p => p.id === selectedPlan)?.price || 0)}
                onClick={handleSubscribe}
              >
                <Crown className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
