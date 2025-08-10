import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Navigation from "@/components/Navigation"

const TermsOfService = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Thryve, you accept and agree to be bound by the terms and provision of this agreement",
        "If you do not agree to abide by the above, please do not use this service",
        "These terms apply to all visitors, users, and others who access or use the service",
        "We reserve the right to update and change the Terms of Service without notice"
      ]
    },
    {
      title: "Description of Service",
      content: [
        "Thryve is a platform that connects job seekers, artists, investors, and employers in one ecosystem",
        "We provide tools for creating profiles, showcasing work, finding opportunities, and networking",
        "The service includes both free and premium features, with premium features available through subscription",
        "We reserve the right to modify or discontinue the service at any time without notice"
      ]
    },
    {
      title: "User Accounts and Registration",
      content: [
        "You must provide accurate and complete information when creating an account",
        "You are responsible for maintaining the confidentiality of your account credentials",
        "You are responsible for all activities that occur under your account",
        "You must notify us immediately of any unauthorized use of your account",
        "We reserve the right to suspend or terminate accounts that violate these terms"
      ]
    },
    {
      title: "User Content and Conduct",
      content: [
        "You retain ownership of content you upload to your profile, but grant us license to use it on the platform",
        "You are solely responsible for the content you post and its accuracy",
        "You agree not to post content that is illegal, harmful, threatening, abusive, or offensive",
        "You agree not to impersonate others or misrepresent your identity or qualifications",
        "We reserve the right to remove content that violates these terms without notice"
      ]
    },
    {
      title: "Intellectual Property Rights",
      content: [
        "The Thryve platform and its original content, features, and functionality are owned by us and are protected by copyright, trademark, and other laws",
        "You may not reproduce, distribute, modify, or create derivative works of our platform without permission",
        "User-generated content remains the property of the respective users",
        "By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on the platform"
      ]
    },
    {
      title: "Premium Services and Payments",
      content: [
        "Premium features are available through paid subscription plans",
        "All fees are non-refundable unless otherwise stated",
        "Subscription fees are charged in advance on a monthly or annual basis",
        "You may cancel your subscription at any time, but cancellation will take effect at the end of the current billing period",
        "We reserve the right to change pricing with 30 days' notice"
      ]
    },
    {
      title: "Privacy and Data Protection",
      content: [
        "Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use information",
        "By using the service, you consent to the collection and use of information as outlined in our Privacy Policy",
        "We implement appropriate security measures to protect your personal information",
        "You have the right to access, update, and delete your personal information"
      ]
    },
    {
      title: "Prohibited Uses",
      content: [
        "You may not use the service for any illegal or unauthorized purpose",
        "You may not transmit any viruses, malware, or other harmful code",
        "You may not attempt to gain unauthorized access to our systems or other users' accounts",
        "You may not engage in any activity that disrupts or interferes with the service",
        "You may not harvest or collect user information without consent"
      ]
    },
    {
      title: "Third-Party Services",
      content: [
        "Our platform may integrate with third-party services for enhanced functionality",
        "We are not responsible for the availability, content, or practices of third-party services",
        "Your interactions with third-party services are governed by their respective terms and conditions",
        "We disclaim all liability for any issues arising from your use of third-party services"
      ]
    },
    {
      title: "Disclaimers and Limitation of Liability",
      content: [
        "The service is provided 'as is' without warranties of any kind, either express or implied",
        "We do not warrant that the service will be uninterrupted, secure, or error-free",
        "We are not responsible for the conduct of users or the accuracy of user-generated content",
        "Our liability is limited to the maximum extent permitted by law",
        "In no event shall we be liable for any indirect, incidental, or consequential damages"
      ]
    },
    {
      title: "Indemnification",
      content: [
        "You agree to indemnify and hold us harmless from any claims arising from your use of the service",
        "This includes claims related to your content, your conduct, or your violation of these terms",
        "You will defend, indemnify, and hold us harmless from all liabilities, costs, and expenses",
        "This indemnification obligation will survive termination of your account"
      ]
    },
    {
      title: "Termination",
      content: [
        "We may terminate or suspend your account at any time for violations of these terms",
        "You may terminate your account at any time by contacting customer support",
        "Upon termination, your right to use the service will cease immediately",
        "We reserve the right to delete your account and content after termination",
        "Provisions that should survive termination will remain in effect"
      ]
    },
    {
      title: "Governing Law and Disputes",
      content: [
        "These terms are governed by the laws of the State of California, United States",
        "Any disputes will be resolved in the courts of California",
        "You agree to submit to the personal jurisdiction of these courts",
        "If any provision of these terms is found to be unenforceable, the remainder will remain in effect"
      ]
    },
    {
      title: "Changes to Terms",
      content: [
        "We reserve the right to modify these terms at any time",
        "Changes will be posted on this page with an updated effective date",
        "Your continued use of the service after changes constitutes acceptance of the new terms",
        "We encourage you to review these terms periodically for updates"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <Card className="shadow-card mb-8">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Thryve! These Terms of Service ("Terms") govern your use of our platform that connects 
                job seekers, artists, investors, and employers. These Terms constitute a legally binding agreement 
                between you and Thryve. Please read these Terms carefully before using our service.
              </p>
            </CardContent>
          </Card>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <h2 className="text-2xl font-heading font-semibold text-foreground">
                    {index + 1}. {section.title}
                  </h2>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Information */}
          <Card className="shadow-card mt-8">
            <CardHeader>
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Contact Information
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> legal@thryve.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Innovation Street, San Francisco, CA 94105</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default TermsOfService