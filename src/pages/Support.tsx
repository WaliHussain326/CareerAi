import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  FileText,
  Video,
  Search,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does the AI career assessment work?",
    answer:
      "Our AI assessment analyzes your responses to questions about your skills, interests, and preferences. Using machine learning algorithms, it matches your profile against hundreds of career paths to provide personalized recommendations.",
  },
  {
    question: "Is my data secure and confidential?",
    answer:
      "Yes, we take data privacy seriously. All your personal information and assessment responses are encrypted and stored securely. We never share your data with third parties without your explicit consent.",
  },
  {
    question: "How accurate are the career recommendations?",
    answer:
      "Our recommendations have a 95% satisfaction rate based on user feedback. The AI continuously learns from user outcomes to improve accuracy. However, we recommend using our suggestions as a starting point for exploration.",
  },
  {
    question: "Can I retake the career assessment?",
    answer:
      "Yes, you can retake the assessment anytime. As your skills and interests evolve, we recommend retaking it every 6-12 months to get updated recommendations.",
  },
  {
    question: "What learning resources are included?",
    answer:
      "We provide curated learning paths, course recommendations, and skill-building resources for each career path. These include free and premium courses from top platforms like Coursera, Udemy, and LinkedIn Learning.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team through the chat widget, email at support@careerai.com, or by submitting a ticket. We typically respond within 24 hours on business days.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Documentation",
    description: "Detailed guides and tutorials",
    link: "#",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    link: "#",
  },
  {
    icon: MessageCircle,
    title: "Community Forum",
    description: "Get help from other users",
    link: "#",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@careerai.com",
    link: "mailto:support@careerai.com",
  },
];

const Support = () => {
  return (
    <DashboardLayout title="Help & Support" subtitle="We're here to help you succeed">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for help articles..."
            className="h-12 pl-12 text-base"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* FAQs */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 card-shadow"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-5 card-shadow"
          >
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-3">
              {resources.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.link}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <resource.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {resource.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl gradient-cta p-6 text-primary-foreground"
          >
            <MessageCircle className="h-10 w-10 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Need more help?</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <Button className="w-full bg-white text-primary hover:bg-white/90">
              Start Live Chat
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
