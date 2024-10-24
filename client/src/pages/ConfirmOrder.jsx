import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FadeLoader from 'react-spinners/FadeLoader'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import error from '../assets/error.png'
import success from '../assets/success.png'
import { stripe_sky } from '../utils/config'

const load = async () => {
  return await loadStripe(stripe_sky)
}

const ConfirmOrder = ({sellerId}) => {
  const [loader, setLoader] = useState(true)
  const [stripe, setStripe] = useState('')
  const [message, setMessage] = useState(null)

  // Consolidated useEffect to handle both stripe initialization and payment intent retrieval
  useEffect(() => {
    const getStripeAndPaymentIntent = async () => {
      try {
        const tempStripe = await load()  // Load Stripe
        setStripe(tempStripe)

        // Check if payment_intent_client_secret is in the URL
        const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret')
        if (!clientSecret) {
          setMessage('failed')
          return
        }

        // Retrieve the payment intent using Stripe
        const { paymentIntent } = await tempStripe.retrievePaymentIntent(clientSecret)
        console.log(paymentIntent)
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage('succeeded')
            break
          case "processing":
            setMessage('processing')
            break
          case "requires_payment_method":
            setMessage('failed')
            break
          default:
            setMessage('failed')
        }
      } catch (error) {
        setMessage('failed')
        console.error('Error retrieving payment intent:', error)
      }
    }

    getStripeAndPaymentIntent()
  }, [])

  // Update payment status in the backend once the payment succeeds
  const update_payment = async () => {
    const orderId = localStorage.getItem('orderId')
    if (orderId) {
      try {
        await axios.get(`http://localhost:8000/api/order/confirm/${orderId}`)
        localStorage.removeItem('orderId')  // Clear orderId from localStorage
        setLoader(false)
      } catch (error) {
        console.log('Error updating payment:', error.response.data)
      }
    }
  }

  // Trigger payment update when payment succeeds
  useEffect(() => {
    if (message === 'succeeded') {
      update_payment()
    }
  }, [message])

  return (
    <div className='w-screen h-screen flex justify-center items-center flex-col gap-4'>
      {
        (message === 'failed' || message === 'processing') ? (
          <>
            <img src={error} alt="error logo" />
            <Link className='px-5 py-2 bg-green-500 rounded-sm text-white' to={`${sellerId}/dashboard/my-orders`}>
              Back to Dashboard
            </Link>
          </>
        ) : message === 'succeeded' ? (
          loader ? <FadeLoader /> : (
            <>
              <img src={success} alt="success logo" />
              <Link className='px-5 py-2 bg-green-500 rounded-sm text-white' to={`${sellerId}/dashboard/my-orders`}>
                Back to Dashboard
              </Link>
            </>
          )
        ) : <FadeLoader />
      }
    </div>
  )
}

export default ConfirmOrder