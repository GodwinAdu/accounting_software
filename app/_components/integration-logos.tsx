"use client"

export default function IntegrationLogos() {
  const integrations = [
    'QuickBooks', 'Xero', 'Stripe', 'PayPal', 'Square', 
    'Gusto', 'ADP', 'Salesforce', 'HubSpot', 'Slack'
  ]

  return (
    <div className="py-16 border-y border-border/40 bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-2">Seamless Integrations</h3>
          <p className="text-foreground/60">Connect with your favorite tools</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
          {integrations.map((name, i) => (
            <div 
              key={i} 
              className="flex items-center justify-center p-6 rounded-xl bg-background/50 border border-border/40 hover:border-emerald-500/40 transition-all duration-300 hover:scale-105"
            >
              <span className="text-lg font-semibold text-foreground/70">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
