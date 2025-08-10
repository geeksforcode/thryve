import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Navigation from "@/components/Navigation"

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal Information: When you create an account, we collect information such as your name, email address, phone number, and professional details.",
        "Profile Information: Including your bio, skills, experience, portfolio items, and any other information you choose to share on your profile.",
        "Usage Data: We collect information about how you use our platform, including pages visited, features used, and time spent on the platform.",
        "Device Information: Information about the device you use to access our platform, including IP address, browser type, and operating system."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our services and platform functionality",
        "To connect job seekers, artists, investors, and employers within our ecosystem",
        "To send important notifications about your account and platform updates",
        "To improve our platform and develop new features based on user feedback",
        "To prevent fraud and ensure platform security",
        "To comply with legal obligations and enforce our terms of service"
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "Profile Visibility: Information you include in your public profile is visible to other users on the platform",
        "Service Providers: We may share information with trusted third-party service providers who help us operate our platform",
        "Legal Requirements: We may disclose information when required by law or to protect our rights and the safety of our users",
        "Business Transfers: In the event of a merger or acquisition, user information may be transferred as part of the business assets",
        "Consent: We may share information with your explicit consent for specific purposes"
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction",
        "We use industry-standard encryption for data transmission and storage",
        "Our servers are hosted in secure facilities with appropriate physical and digital security measures",
        "We regularly review and update our security practices to ensure the protection of your data",
        "However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security"
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access: You can request access to the personal information we have about you",
        "Correction: You can update or correct your profile information at any time through your account settings",
        "Deletion: You can request deletion of your account and personal information, subject to legal retention requirements",
        "Portability: You can request a copy of your data in a machine-readable format",
        "Opt-out: You can opt out of certain communications and data processing activities"
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        "We use cookies and similar technologies to enhance your experience on our platform",
        "Cookies help us remember your preferences and provide personalized content",
        "We use analytics tools to understand how users interact with our platform",
        "You can control cookie settings through your browser preferences",
        "Some features of our platform may not function properly if cookies are disabled"
      ]
    },
    {
      title: "Third-Party Services",
      content: [
        "Our platform may integrate with third-party services for enhanced functionality",
        "We are not responsible for the privacy practices of third-party services",
        "We encourage you to review the privacy policies of any third-party services you use",
        "Your interactions with third-party services are governed by their respective privacy policies"
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        "Our platform is not intended for children under the age of 13",
        "We do not knowingly collect personal information from children under 13",
        "If we become aware that we have collected information from a child under 13, we will delete it promptly",
        "Parents or guardians who believe their child has provided personal information should contact us immediately"
      ]
    },
    {
      title: "International Data Transfers",
      content: [
        "Your information may be transferred to and processed in countries other than your own",
        "We ensure appropriate safeguards are in place for international data transfers",
        "By using our platform, you consent to the transfer of your information to other countries",
        "We comply with applicable data protection laws regarding international transfers"
      ]
    },
    {
      title: "Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements",
        "We will notify you of material changes by posting the updated policy on our platform",
        "Your continued use of the platform after changes indicates your acceptance of the updated policy",
        "We encourage you to review this policy periodically for any updates"
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
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <Card className="shadow-card mb-8">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                At Thryve, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, share, and protect your information when you use our platform 
                that connects job seekers, artists, investors, and employers. By using Thryve, you agree to the collection 
                and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Policy Sections */}
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
                Contact Us
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@thryve.com</p>
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

export default PrivacyPolicy