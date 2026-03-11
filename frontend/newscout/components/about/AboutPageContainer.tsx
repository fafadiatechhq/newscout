import Layout from '@/components/Layout'
import { Users, Zap, Shield, Globe } from 'lucide-react'

const values = [
  {
    icon: Zap,
    title: 'Speed & Accuracy',
    description:
      'We aggregate from 50+ verified publishers in real time, so you never miss a beat.',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description:
      'Every article links back to its original source. We never rewrite or editorialize.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description:
      'From local beats to international affairs, NewScout covers every corner of the world.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'Built for readers, researchers, and professionals who demand more from their news.',
  },
]

const team = [
  { name: 'Alex Chen', role: 'Co-Founder & CEO' },
  { name: 'Maya Patel', role: 'Co-Founder & CTO' },
  { name: 'Jordan Lee', role: 'Head of Product' },
  { name: 'Sam Rivera', role: 'Lead Designer' },
]

const AboutPageContainer = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
            About NewScout
          </h1>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-primary-foreground/80">
            We believe staying informed shouldn't be overwhelming. NewScout is
            the centralized, searchable, and customizable news experience built
            for the modern reader.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container py-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-2xl font-bold text-foreground md:text-3xl">
            Our Mission
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            NewScout aggregates, curates, and delivers news from dozens of
            trusted publishers into a single, distraction-free platform. We
            strip away the noise so you can focus on what matters — reliable
            information, surfaced fast.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-surface py-10">
        <div className="container">
          <h2 className="mb-8 text-center font-serif text-2xl font-bold text-foreground md:text-3xl">
            What We Stand For
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container py-10">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-foreground md:text-3xl">
          Meet the Team
        </h2>
        <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
          {team.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {t.name[0]}
              </div>
              <div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default AboutPageContainer
