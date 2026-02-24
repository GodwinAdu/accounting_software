import Link from 'next/link'
import { ArrowLeft, Briefcase, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function CareersPage() {
  const jobs = [
    { title: 'Senior Full Stack Engineer', location: 'Remote', type: 'Full-time', department: 'Engineering' },
    { title: 'Product Designer', location: 'New York, NY', type: 'Full-time', department: 'Design' },
    { title: 'Customer Success Manager', location: 'Remote', type: 'Full-time', department: 'Customer Success' },
    { title: 'DevOps Engineer', location: 'San Francisco, CA', type: 'Full-time', department: 'Engineering' },
    { title: 'Marketing Manager', location: 'Remote', type: 'Full-time', department: 'Marketing' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl text-foreground/70">
            Help us build the future of payroll and accounting software. We're looking for talented, passionate people to join our growing team.
          </p>
        </div>

        <div className="grid gap-6 mb-16">
          {jobs.map((job, i) => (
            <Card key={i} className="p-6 hover:border-emerald-500/40 transition-all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-foreground/60">
                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={16} />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-2">
                      <Briefcase size={16} />
                      {job.department}
                    </span>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see a perfect fit?</h2>
          <p className="text-foreground/70 mb-6">
            We're always interested in hearing from talented people. Send us your resume!
          </p>
          <Button size="lg" variant="outline">
            Send General Application
          </Button>
        </div>
      </div>
    </div>
  )
}
