"use client"
import { Link } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import {
  Calendar,
  Users,
  MapPin,
  BarChart3,
  Mail,
  ArrowRight,
  Star,
  Globe,
  Shield,
  Clock,
  FileText,
  MessageSquare,
  Bell,
} from "lucide-react"

export default function Welcome({ auth, canLogin, canRegister }) {
  const features = [
    {
      icon: Calendar,
      title: "Planification Intelligente",
      description: "Organisez vos événements avec des outils de planification avancés et des calendriers intuitifs.",
    },
    {
      icon: Users,
      title: "Gestion des Participants",
      description: "Gérez facilement les inscriptions, les invitations et la communication avec vos participants.",
    },
    {
      icon: BarChart3,
      title: "Analytics Avancés",
      description: "Suivez les performances de vos événements avec des rapports détaillés et des insights précieux.",
    },
    {
      icon: MapPin,
      title: "Gestion des Lieux",
      description: "Organisez vos événements en présentiel, virtuel ou hybride avec une gestion complète des espaces.",
    },
    {
      icon: Mail,
      title: "Communication Automatisée",
      description: "Envoyez des invitations, rappels et suivis automatiquement à vos participants.",
    },
    {
      icon: Shield,
      title: "Sécurité & Conformité",
      description: "Plateforme sécurisée respectant les normes RGPD pour protéger vos données.",
    },
  ]

  const projectFeatures = [
    { name: "Création d'événements", icon: Calendar, color: "bg-violet-100 text-violet-800" },
    { name: "Emploi du temps intelligent", icon: Clock, color: "bg-green-100 text-green-800" },
    { name: "Messagerie temps réel", icon: MessageSquare, color: "bg-purple-100 text-purple-800" },
    { name: "Gestion des participants", icon: Users, color: "bg-orange-100 text-orange-800" },
    { name: "Notifications", icon: Bell, color: "bg-pink-100 text-pink-800" },
    { name: "Tableau de bord", icon: BarChart3, color: "bg-indigo-100 text-indigo-800" },
    { name: "Export PDF", icon: FileText, color: "bg-blue-100 text-blue-800" },
  ]

  const testimonials = [
    {
      name: "Khaldi Alami",
      role: "Directrice Événementiel",
      company: "TechCorp",
      content: "Cette plateforme a révolutionné notre façon d'organiser nos conférences. Gain de temps considérable !",
      rating: 5,
    },
    {
      name: "Nour El-Jammal",
      role: "Responsable Formation",
      company: "EduPro",
      content: "Interface intuitive et fonctionnalités complètes. Nos participants sont ravis de l'expérience.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/event-flex-calendar-bg.jpg"
          alt="Event-Flex Calendar Background"
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/images/event-flex-logo.png"
                alt="Event-Flex Logo"
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-gray-900">Event-Flex</span>
            </div>
            <nav className="flex items-center space-x-4">
              {canLogin && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={route('login')}>Connexion</Link>
                </Button>
              )}
              {canRegister && (
                <Button size="sm" asChild>
                  <Link href={route('register')}>S'inscrire</Link>
                </Button>
              )}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 relative min-h-[80vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/event-flex-calendar-bg.jpg"
              alt="Background"
              className="w-full h-full object-cover opacity-[0.1] scale-100"
            />
          </div>
          <div className="container mx-auto text-center max-w-6xl relative z-10">
            <div className="bg-gray-400/30 backdrop-blur-sm rounded-lg p-8 mb-8 max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Simplifiez la gestion de vos <span className="text-violet-600">événements professionnels</span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Une plateforme moderne conçue pour simplifier l'organisation, la planification et la participation à vos
                conférences, ateliers et séminaires professionnels.
              </p>
            </div>
            
            <div className="mt-12 mb-12">
              <div className="flex flex-wrap justify-center gap-4">
                {projectFeatures.map((feature, index) => (
                  <Badge key={index} variant="secondary" className={`${feature.color} px-3 py-1 flex items-center`}>
                    <feature.icon className="w-3.5 h-3.5 mr-1" />
                    {feature.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-white/60 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tout ce dont vous avez besoin pour réussir vos événements
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Des outils puissants et intuitifs pour gérer chaque aspect de vos événements professionnels
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/90 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-violet-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 px-4 bg-violet-600/90 backdrop-blur-sm text-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-violet-100">Événements Organisés</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-violet-100">Entreprises Clientes</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1M+</div>
                <div className="text-violet-100">Participants Satisfaits</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-violet-100">Temps de Disponibilité</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-4 bg-gray-50/60 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
              <p className="text-xl text-gray-600">
                Découvrez pourquoi des milliers d'organisateurs nous font confiance
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role} - {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/90 backdrop-blur-sm text-white py-12 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src="/images/event-flex-logo.png"
                    alt="Event-Flex Logo"
                    className="w-8 h-8"
                  />
                  <span className="text-xl font-bold">Event-Flex</span>
                </div>
                <p className="text-gray-400">La plateforme de référence pour la gestion d'événements professionnels.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Planification</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Création d'événements
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Planning intelligent
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Générateur d'emploi du temps
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Exportation PDF
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Communication</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Messagerie temps réel
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Messages directs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Notifications email
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Alertes de modification
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Gestion</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Gestion des participants
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Attribution des rôles
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Tableau de bord
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Statistiques avancées
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Event-Flex. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
