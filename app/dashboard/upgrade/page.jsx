'use client'

import { db } from '@/configs/db'
import { USER_TABLE } from '@/configs/schema'
import { useUser } from '@clerk/clerk-react'
import { Check } from 'lucide-react'
import axios from 'axios'
import { eq } from 'drizzle-orm'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PricingPlans() {
  const { user } = useUser()
  const [userDetails, setUserDetails] = useState()

  useEffect(() => {
    if (user) {
      getUserDetails()
    }
  }, [user])

  const getUserDetails = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress
      console.log('Fetching details for email:', email)

      const result = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, email))

      console.log('Database Result:', result)
      if (result && result.length > 0) {
        setUserDetails(result[0])
      } else {
        console.warn('No user details found for this email')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  const onCheckoutClick = async (priceId) => {
    try {
      const result = await axios.post('/api/payment/checkout', {
        priceId: priceId,
      })

      console.log('Checkout URL:', result.data?.url)
      window.open(result.data?.url)
    } catch (error) {
      console.error('Error during checkout:', error)
    }
  }

  const plans = [
    {
      name: "Free",
      price: "0$",
      period: "/month",
      features: [
        "5 Course Generate",
        "Limited Support",
        "Email support",
        "Help center access"
      ],
      buttonText: "Current Plan",
      buttonAction: () => {},
      isCurrentPlan: !userDetails?.isMember
    },
    {
      name: "Monthly",
      price: "9.99$",
      period: "/Month",
      features: [
        "Unlimited Course Generate",
        "Unlimited Flashcard, Quiz",
        "Email support",
        "Help center access"
      ],
      buttonText: userDetails?.isMember ? "Manage Payment" : "Subscribe Now",
      buttonAction: () => userDetails?.isMember ? {} : onCheckoutClick(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY),
      isCurrentPlan: userDetails?.isMember
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Plans</h1>
        <p className="text-muted-foreground text-center">
          Update your plan to generate unlimited courses for your exam
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.isCurrentPlan ? 'border-primary' : ''}`}>
              <CardHeader>
                <CardTitle className="flex flex-col items-center gap-4">
                  <span>{plan.name}</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6"
                  variant={plan.isCurrentPlan ? "secondary" : "default"}
                  onClick={plan.buttonAction}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

