import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SubscriptionSection() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-black/70">Subscription Plan:</p>
        <a
          href="#"
          className="text-sm text-[var(--color-primary)] hover:underline font-medium"
        >
          Update Plan
        </a>
      </div>

      <div className="border-2 border-[#E8F0FE] rounded-lg p-6 relative">
        <span className="absolute top-4 right-4 bg-[#3B60C9] text-white text-xs font-medium px-3 py-1 rounded-full">
          Subscription plan
        </span>

        <div className="mt-2">
          <h4 className="text-xl font-bold text-black mb-4">
            Lifetime Plan
          </h4>
          <p className="text-2xl font-bold text-[var(--color-primary)] mb-6">
            10000৳ /year
          </p>

          <ul className="space-y-3 mb-6">
            {[
              'Update Your Photo',
              'Update & Add Your Phone No.',
              'Smart Notification System',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-black/80">{feature}</span>
              </li>
            ))}
          </ul>

          <Button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]">
            Current plan
          </Button>
        </div>
      </div>
    </div>
  )
}
