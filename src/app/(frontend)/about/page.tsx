'use client'

import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  Globe, 
  Shield, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Star,
  MapPin,
  Phone,
  Mail,
  Building2,
  TrendingUp,
  Users2,
  Newspaper
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  const stats = [
    { label: 'Active Jobs', value: '500+', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Happy Users', value: '10K+', icon: Users, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'News Articles', value: '200+', icon: Newspaper, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Success Rate', value: '95%', icon: Award, color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We believe in putting our local community at the heart of everything we do, creating opportunities that matter to Bihar residents.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100'
    },
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Every job posting and news article is verified to ensure authenticity and build trust within our community.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously evolve our platform with cutting-edge technology to provide the best user experience.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-100'
    },
    {
      icon: Globe,
      title: 'Local Focus',
      description: 'Deep understanding of local needs, culture, and opportunities specific to Bihar and its diverse regions.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100'
    }
  ]

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      description: 'Passionate about connecting Bihar\'s talent with opportunities',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      description: 'Ensuring smooth operations and user satisfaction',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Amit Singh',
      role: 'Tech Lead',
      description: 'Building innovative solutions for our community',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      gradient: 'from-green-500 to-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
              <Building2 className="w-4 h-4 mr-2" />
              About Apna Journey
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Empowering <span className="text-yellow-400">Bihar</span><br />
              <span className="text-4xl md:text-5xl font-semibold text-blue-100">One Opportunity at a Time</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-4xl mx-auto">
              बिहार की आवाज़ - Your trusted platform for opportunities and news across Bihar
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
              We are dedicated to empowering the Bihar community by connecting talented individuals 
              with meaningful opportunities and keeping everyone informed about local developments.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Building a stronger community through verified opportunities and trusted information
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${stat.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-10 h-10 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gradient-to-r from-slate-50 to-blue-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                    <Target className="w-4 h-4 mr-2" />
                    Our Mission
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    Bridging Talent with <span className="text-blue-600">Opportunity</span>
                  </h2>
                  <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                    To bridge the gap between local talent and opportunities across Bihar, creating a 
                    thriving ecosystem where every individual can find meaningful employment and 
                    stay connected with their community.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    'Connect local talent with quality opportunities',
                    'Provide accurate and timely local news',
                    'Foster community growth and development',
                    'Ensure transparency and trust in all interactions'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-slate-700 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Our Vision
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    Empowering Every <span className="text-purple-600">Resident</span>
                  </h2>
                  <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                    To become the leading platform that empowers every resident of Bihar to achieve 
                    their professional goals while staying informed and connected with their community.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Why Bihar?
                  </h3>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    Bihar is not just a state; it&apos;s a community with rich heritage, diverse talent, 
                    and immense potential. We&apos;re here to unlock that potential and help our 
                    community thrive in the modern economy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium mb-6">
                <Heart className="w-4 h-4 mr-2" />
                Our Core Values
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                What Drives Us Forward
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                These principles guide everything we do and shape our commitment to the Bihar community.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div key={index} className={`${value.bgColor} p-8 rounded-2xl group hover:shadow-lg transition-all duration-300`}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${value.iconBg} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${value.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-r from-slate-50 to-blue-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Users2 className="w-4 h-4 mr-2" />
                Meet Our Team
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Passionate People, <span className="text-blue-600">Purposeful Impact</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Passionate individuals dedicated to serving the Bihar community and making a difference.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="relative w-40 h-40 mx-auto">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={160}
                        height={160}
                        className="w-full h-full rounded-full object-cover shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
                      />
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br ${member.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-lg mb-4">
                    {member.role}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <Mail className="w-4 h-4 mr-2" />
              Get in Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12">
              Ready to Start Your <span className="text-green-600">Journey?</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Address
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Patna, Bihar<br />
                  India
                </p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Phone
                </h3>
                <p className="text-slate-600">
                  +91 98765 43210
                </p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Email
                </h3>
                <p className="text-slate-600">
                  info@apnajourney.com
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6">
                  Join Our Community Today
                </h3>
                <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of Bihar residents who have found their dream jobs and stay updated with local news.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/jobs"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Browse Jobs
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
                  >
                    Contact Us
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
